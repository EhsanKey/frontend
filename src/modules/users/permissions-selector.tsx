'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  CheckCheck,
  RotateCcw,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { SearchInput } from '@/components/shared';
import {
  PermissionDefinition,
  SYSTEM_PERMISSIONS_LIST,
} from '@/utils/permissions';
import { cn } from '@/utils';

export interface PermissionsSelectorProps {
  selectedPermissions?: string[];
  value?: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
  isDisabled?: boolean;
}

const CATEGORIES: { key: string; labelKey: string }[] = [
  { key: 'all', labelKey: 'categories.all' },
  { key: 'teachings', labelKey: 'categories.teachings' },
  { key: 'professors', labelKey: 'categories.professors' },
  { key: 'courses', labelKey: 'categories.courses' },
  { key: 'academic', labelKey: 'categories.academic' },
  { key: 'moderation', labelKey: 'categories.moderation' },
  { key: 'ai', labelKey: 'categories.ai' },
  { key: 'system', labelKey: 'categories.system' },
];

export const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  selectedPermissions: selectedPermissionsProp,
  value,
  onChange,
  disabled: disabledProp = false,
  isDisabled = false,
}) => {
  const t = useTranslations('users');
  const tPermissions = useTranslations('permissions');
  const selectedPermissions = value ?? selectedPermissionsProp ?? [];
  const disabled = disabledProp || isDisabled;
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getPermissionText = useCallback(
    (path: string, fallback: string): string => {
      const hasFn = tPermissions.has as unknown as (k: string) => boolean;
      const getFn = tPermissions as unknown as (k: string) => string;
      return hasFn(path) ? getFn(path) : fallback;
    },
    [tPermissions],
  );

  const getCategoryLabel = useCallback(
    (labelKey: string): string => {
      const getFn = t as unknown as (k: string) => string;
      return getFn(`permissionsSelector.${labelKey}`);
    },
    [t],
  );

  const filteredPermissions = useMemo(() => {
    return SYSTEM_PERMISSIONS_LIST.filter((p) => {
      const matchCategory =
        activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const localizedTitle = getPermissionText(`items.${p.code}.title`, p.title);
      const localizedDesc = getPermissionText(`items.${p.code}.description`, p.description);
      const matchSearch =
        !q ||
        localizedTitle.toLowerCase().includes(q) ||
        localizedDesc.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, getPermissionText]);

  // Group filtered permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, { title: string; items: PermissionDefinition[] }> = {};
    for (const p of filteredPermissions) {
      if (!groups[p.category]) {
        groups[p.category] = {
          title: t.has(`permissionsSelector.categories.${p.category}`)
            ? t(`permissionsSelector.categories.${p.category}`)
            : p.categoryTitle,
          items: [],
        };
      }
      groups[p.category].items.push(p);
    }
    return groups;
  }, [filteredPermissions, t]);

  const togglePermission = (code: string) => {
    if (disabled) return;
    if (selectedPermissions.includes(code)) {
      onChange(selectedPermissions.filter((c) => c !== code));
    } else {
      onChange([...selectedPermissions, code]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    const allCodes = Array.from(
      new Set([
        ...selectedPermissions,
        ...SYSTEM_PERMISSIONS_LIST.map((p) => p.code),
      ]),
    );
    onChange(allCodes);
  };

  const deselectAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const selectCategory = (categoryKey: string) => {
    if (disabled) return;
    const catCodes = SYSTEM_PERMISSIONS_LIST.filter(
      (p) => p.category === categoryKey,
    ).map((p) => p.code);
    const newSet = new Set([...selectedPermissions, ...catCodes]);
    onChange(Array.from(newSet));
  };

  const deselectCategory = (categoryKey: string) => {
    if (disabled) return;
    const catCodes = new Set(
      SYSTEM_PERMISSIONS_LIST.filter((p) => p.category === categoryKey).map(
        (p) => p.code,
      ),
    );
    onChange(selectedPermissions.filter((code) => !catCodes.has(code)));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-neutral-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <span className="text-body-sm font-semibold text-foreground">
            {t('permissionsSelector.selectedPermissions')}
          </span>
          <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-caption font-bold text-primary-800">
            {t('permissionsSelector.selectionSummary', {
              selected: selectedPermissions.length,
              total: SYSTEM_PERMISSIONS_LIST.length,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={selectAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-caption font-medium text-foreground hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="size-3.5 text-success" />
            {t('permissionsSelector.selectAll')}
          </button>
          <button
            type="button"
            disabled={disabled || selectedPermissions.length === 0}
            onClick={deselectAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-caption font-medium text-danger-600 hover:bg-danger-50 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            {t('permissionsSelector.deselectAll')}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex-1">
          <SearchInput
            queryValue={searchQuery}
            onValueChange={setSearchQuery}
            placeholder={t('permissionsSelector.searchPlaceholder')}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-2.5 py-1.5 text-caption font-medium transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                )}
              >
                {getCategoryLabel(cat.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissions Groups */}
      <div className="flex flex-col gap-5 max-h-[460px] overflow-y-auto pe-1 scrollbar-thin">
        {Object.entries(groupedPermissions).length === 0 ? (
          <div className="py-8 text-center text-body-sm text-neutral-400">
            {t('permissionsSelector.emptyState')}
          </div>
        ) : null}

        {Object.entries(groupedPermissions).map(([catKey, group]) => {
          const catCodes = group.items.map((i) => i.code);
          const allCatSelected = catCodes.every((c) =>
            selectedPermissions.includes(c),
          );

          return (
            <div
              key={catKey}
              className="rounded-xl border border-border bg-surface p-3.5 space-y-3"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-neutral-500" />
                  <h4 className="text-body-sm font-bold text-foreground">
                    {group.title}
                  </h4>
                  <span className="text-caption text-neutral-400">
                    ({group.items.filter((i) => selectedPermissions.includes(i.code)).length} / {group.items.length})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {allCatSelected ? (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => deselectCategory(catKey)}
                      className="text-caption text-danger-600 hover:underline"
                    >
                      {t('permissionsSelector.deselectAllCategory')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => selectCategory(catKey)}
                      className="text-caption text-primary hover:underline font-medium"
                    >
                      {t('permissionsSelector.selectAllCategory')}
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Permission Cards */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {group.items.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.code);
                  const title = getPermissionText(`items.${perm.code}.title`, perm.title);
                  const description = getPermissionText(`items.${perm.code}.description`, perm.description);

                  return (
                    <div
                      key={perm.code}
                      onClick={() => togglePermission(perm.code)}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all select-none',
                        isChecked
                          ? 'border-primary/50 bg-primary-50/50 shadow-xs'
                          : 'border-border/80 bg-surface hover:border-neutral-300 hover:bg-neutral-50/50',
                        disabled && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      {/* Checkbox Icon */}
                      <div
                        className={cn(
                          'mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded border transition-colors',
                          isChecked
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-neutral-300 bg-surface',
                        )}
                      >
                        {isChecked ? <Check className="size-3 stroke-[3]" /> : null}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              'text-body-sm font-semibold truncate',
                              isChecked ? 'text-primary-900' : 'text-neutral-800',
                            )}
                          >
                            {title}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                            {perm.code}
                          </span>
                        </div>
                        <p className="text-caption text-neutral-500 leading-snug line-clamp-2">
                          {description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
