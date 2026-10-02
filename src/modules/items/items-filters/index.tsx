'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import type { ItemsFiltersProps } from './types';

export const ItemsFilters = ({
  search,
  status,
  category,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onReset,
}: ItemsFiltersProps) => {
  const t = useTranslations('items.filters');
  const tCategories = useTranslations('items.categories');
  const tCommon = useTranslations('common');

  const statusOptions = [
    { value: 'all', label: tCommon('statuses.all') },
    { value: 'active', label: tCommon('statuses.active') },
    { value: 'pending', label: tCommon('statuses.pending') },
    { value: 'inactive', label: tCommon('statuses.inactive') },
  ];

  const categoryOptions = [
    { value: 'all', label: t('allCategories') },
    { value: 'general', label: tCategories('general') },
    { value: 'technical', label: tCategories('technical') },
    { value: 'financial', label: tCategories('financial') },
    { value: 'administrative', label: tCategories('administrative') },
  ];

  const hasActiveFilters = Boolean(search || (status && status !== 'all') || (category && category !== 'all'));

  return (
    <div className="bg-surface flex flex-col gap-3 rounded-xl border border-neutral-200/80 p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-xs">
        <SearchInput
          queryValue={search}
          onValueChange={onSearchChange}
          placeholder={t('search')}
          showSearchIcon
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-36">
          <Select
            aria-label={t('status')}
            value={status || 'all'}
            onChange={(key) => onStatusChange(String(key))}
            variant="secondary"
            className="w-full"
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('status')}>
                {statusOptions.map((opt) => (
                  <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                    {opt.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="w-36">
          <Select
            aria-label={t('category')}
            value={category || 'all'}
            onChange={(key) => onCategoryChange(String(key))}
            variant="secondary"
            className="w-full"
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('category')}>
                {categoryOptions.map((opt) => (
                  <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                    {opt.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onPress={onReset}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <RotateCcw className={ICON_SIZE_CLASS.sm} />
            {t('reset')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ItemsFilters;
