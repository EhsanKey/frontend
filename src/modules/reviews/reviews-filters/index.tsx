'use client';

import { ListBox, Select } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@/components/shared';
import type { ReviewStatus } from '@/models';

interface ReviewsFiltersProps {
  search: string;
  status: ReviewStatus | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (status: ReviewStatus | 'all') => void;
}

export const ReviewsFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ReviewsFiltersProps) => {
  const t = useTranslations('reviews.filters');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 sm:max-w-md">
        <SearchInput
          queryValue={search}
          onValueChange={onSearchChange}
          placeholder={t('search')}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-48">
          <Select
            selectedKey={status}
            onSelectionChange={(key) => onStatusChange(String(key) as ReviewStatus | 'all')}
            variant="secondary"
            className="w-full"
            aria-label={t('status')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('status')}>
                <ListBox.Item id="all" textValue={t('all')}>
                  {t('all')}
                </ListBox.Item>
                <ListBox.Item id="pending" textValue={t('pending')}>
                  {t('pending')}
                </ListBox.Item>
                <ListBox.Item id="approved" textValue={t('approved')}>
                  {t('approved')}
                </ListBox.Item>
                <ListBox.Item id="rejected" textValue={t('rejected')}>
                  {t('rejected')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
