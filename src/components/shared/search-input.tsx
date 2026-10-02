'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks';
import { cn } from '@/utils';

interface SearchInputProps {
  queryValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  showSearchIcon?: boolean;
  debounceMs?: number;
  disabled?: boolean;
}

/**
 * High-performance, jitter-free SearchInput
 * Eliminates cursor jumping, text truncation, and focus resets by decoupling
 * active user typing from asynchronous URL searchParam round-trips.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  queryValue = '',
  onValueChange,
  placeholder: placeholderProp,
  label,
  ariaLabel,
  className,
  showSearchIcon = true,
  debounceMs = 350,
  disabled = false,
}) => {
  const tCommon = useTranslations('common');
  const placeholder = placeholderProp ?? tCommon('search.placeholder');
  const [value, setValue] = useState(queryValue ?? '');
  const isFocusedRef = useRef(false);
  const lastEmittedValueRef = useRef(queryValue ?? '');
  const onValueChangeRef = useRef(onValueChange);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep callback ref updated
  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  });

  // Debounced emission
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    const trimmed = debouncedValue.trim();
    if (trimmed !== lastEmittedValueRef.current) {
      lastEmittedValueRef.current = trimmed;
      onValueChangeRef.current?.(trimmed);
    }
  }, [debouncedValue]);

  // Synchronize external queryValue ONLY when input is NOT actively focused by the user
  useEffect(() => {
    if (!isFocusedRef.current) {
      const incoming = queryValue ?? '';
      if (incoming !== value) {
        queueMicrotask(() => {
          setValue(incoming);
          lastEmittedValueRef.current = incoming.trim();
        });
      }
    }
  }, [queryValue, value]);

  const handleClear = () => {
    setValue('');
    lastEmittedValueRef.current = '';
    onValueChangeRef.current?.('');
    inputRef.current?.focus();
  };

  const computedAriaLabel = ariaLabel || label || placeholder;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-body-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {showSearchIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={computedAriaLabel}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;
            // On blur, harmonize value with external queryValue if empty
            if (!value.trim() && queryValue) {
              setValue(queryValue);
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className={cn(
            'w-full h-10 rounded-xl border border-neutral-300/80 bg-white text-body-sm text-neutral-900',
            'transition-colors duration-150 ease-in-out placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
            showSearchIcon ? 'pr-9.5' : 'pr-3.5',
            value ? 'pl-9' : 'pl-3.5',
          )}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={tCommon('search.clearAriaLabel')}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
