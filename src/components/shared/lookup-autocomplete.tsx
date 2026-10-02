'use client';

import React, {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';
import { useDebounce } from '@/hooks';

export interface LookupAutocompleteProps<T> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string | number | null;
  initialLabel?: string;
  onChange?: (value: string, item?: T) => void;
  onClear?: () => void;
  fetchOptions: (query: string) => Promise<T[]>;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

export function LookupAutocomplete<T>({
  label,
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  value,
  initialLabel,
  onChange,
  onClear,
  fetchOptions,
  getOptionLabel,
  getOptionValue,
  renderOption,
  isInvalid = false,
  errorMessage,
  isDisabled = false,
  isClearable = true,
  className,
  size = 'md',
  'aria-label': ariaLabel,
}: LookupAutocompleteProps<T>) {
  const tCommon = useTranslations('common');
  const placeholder = placeholderProp ?? tCommon('ui.selectPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? tCommon('ui.searchItemsPlaceholder');
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [displayLabel, setDisplayLabel] = useState<string>(initialLabel || '');
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Sync state during render when value or initialLabel changes (official React pattern)
  const [prevValue, setPrevValue] = useState(value);
  const [prevInitialLabel, setPrevInitialLabel] = useState(initialLabel);
  if (value !== prevValue || initialLabel !== prevInitialLabel) {
    setPrevValue(value);
    setPrevInitialLabel(initialLabel);
    if (!value) {
      setSelectedItem(null);
      setDisplayLabel('');
    } else if (initialLabel) {
      setDisplayLabel(initialLabel);
    } else if (selectedItem && getOptionValue(selectedItem) === String(value)) {
      setDisplayLabel(getOptionLabel(selectedItem));
    }
  }

  // Auto-resolve label for value if displayLabel is still empty
  useEffect(() => {
    let ignore = false;
    if (value && !displayLabel) {
      fetchOptions('')
        .then((results) => {
          if (!ignore && results && results.length > 0) {
            const match = results.find(
              (item) => getOptionValue(item) === String(value),
            );
            if (match) {
              setSelectedItem(match);
              setDisplayLabel(getOptionLabel(match));
            }
          }
        })
        .catch(() => {});
    }
    return () => {
      ignore = true;
    };
  }, [value, displayLabel, fetchOptions, getOptionValue, getOptionLabel]);

  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoading(true);
        fetchOptions(debouncedSearchTerm)
          .then((results) => {
            if (!ignore) {
              setOptions(results || []);
              if (value && (!selectedItem || !displayLabel)) {
                const match = (results || []).find(
                  (item) => getOptionValue(item) === String(value),
                );
                if (match) {
                  setSelectedItem(match);
                  setDisplayLabel(getOptionLabel(match));
                }
              }
            }
          })
          .catch((err) => {
            console.error('Failed to fetch lookup options:', err);
            if (!ignore) setOptions([]);
          })
          .finally(() => {
            if (!ignore) setIsLoading(false);
          });
      }, 0);

      return () => {
        ignore = true;
        clearTimeout(timer);
      };
    }
  }, [
    debouncedSearchTerm,
    isOpen,
    fetchOptions,
    value,
    selectedItem,
    displayLabel,
    getOptionValue,
    getOptionLabel,
  ]);

  // Handle outside click to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setHighlightedIndex(-1);
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isDisabled) return;
    setIsOpen((prev) => {
      if (prev) {
        setSearchTerm('');
      }
      return !prev;
    });
  };

  const handleSelect = (item: T) => {
    const val = getOptionValue(item);
    const lbl = getOptionLabel(item);
    setSelectedItem(item);
    setDisplayLabel(lbl);
    setIsOpen(false);
    onChange?.(val, item);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(null);
    setDisplayLabel('');
    onChange?.('', undefined);
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        handleSelect(options[highlightedIndex]);
      }
    }
  };

  const hasValue = Boolean(value || displayLabel);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex flex-col gap-1.5 w-full', className)}
      dir="rtl"
    >
      {label ? (
        <label
          htmlFor={generatedId}
          className="text-body-sm font-medium text-foreground text-start"
        >
          {label}
        </label>
      ) : null}

      {/* Trigger Button */}
      <div
        id={generatedId}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${generatedId}-listbox`}
        aria-haspopup="listbox"
        aria-label={ariaLabel || label || placeholder}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center justify-between gap-2 border bg-surface text-foreground transition-all cursor-pointer select-none rounded-md px-3 text-start outline-none',
          size === 'sm' ? 'h-9 min-h-9 text-caption' : 'h-11 min-h-11 text-body-sm',
          isInvalid
            ? 'border-danger-500 focus-within:ring-danger-500/20'
            : 'border-border hover:border-primary-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none bg-neutral-50',
          isOpen && 'border-primary ring-2 ring-primary/20',
        )}
      >
        <span
          className={cn(
            'flex-1 truncate',
            !hasValue ? 'text-neutral-400' : 'text-foreground font-medium',
          )}
        >
          {displayLabel || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted">
          {hasValue && isClearable && !isDisabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label={tCommon('ui.clearSelection')}
            >
              <X className="size-3.5" />
            </button>
          ) : null}

          <ChevronDown
            className={cn(
              'size-4 text-neutral-400 transition-transform duration-200',
              isOpen && 'rotate-180 text-primary',
            )}
          />
        </div>
      </div>

      {/* Error Message */}
      {isInvalid && errorMessage ? (
        <p className="text-caption text-danger-500 text-start">{errorMessage}</p>
      ) : null}

      {/* Popover Dropdown */}
      {isOpen ? (
        <div
          role="listbox"
          className="absolute z-50 top-full mt-1.5 w-full min-w-[240px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Field */}
          <div className="relative mb-2 flex items-center border border-border rounded-lg bg-neutral-50/70 px-2.5 py-1.5 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/10 transition-colors">
            <Search className="size-4 text-neutral-400 shrink-0 me-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-body-sm text-foreground placeholder:text-neutral-400 outline-none"
            />
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-primary shrink-0 ms-1.5" />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
            {options.length === 0 && !isLoading ? (
              <div className="py-6 px-3 text-center text-caption text-neutral-400">
                {tCommon('ui.noResultsFound')}
              </div>
            ) : null}

            {options.map((item, idx) => {
              const itemVal = getOptionValue(item);
              const itemLabel = getOptionLabel(item);
              const isSelected = String(value) === itemVal;
              const isHighlighted = highlightedIndex === idx;

              return (
                <div
                  key={itemVal}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-body-sm text-start select-none',
                    isSelected
                      ? 'bg-primary-50 text-primary-900 font-semibold'
                      : isHighlighted
                        ? 'bg-neutral-100/80 text-foreground'
                        : 'text-neutral-700 hover:bg-neutral-50',
                  )}
                >
                  <div className="flex-1 truncate">
                    {renderOption ? (
                      renderOption(item, isSelected)
                    ) : (
                      <span>{itemLabel}</span>
                    )}
                  </div>

                  {isSelected ? (
                    <Check className="size-4 text-primary shrink-0" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
