'use client';

import { ListBox, Select } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@/components/shared';
import type { ResourceKind, ResourceStatus } from '@/models';

interface ResourcesFiltersProps {
  search: string;
  status: ResourceStatus | 'all';
  resourceKind: ResourceKind | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (status: ResourceStatus | 'all') => void;
  onKindChange: (kind: ResourceKind | 'all') => void;
}

export const ResourcesFilters = ({
  search,
  status,
  resourceKind,
  onSearchChange,
  onStatusChange,
  onKindChange,
}: ResourcesFiltersProps) => {
  const t = useTranslations('resources.filters');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 sm:max-w-md">
        <SearchInput
          queryValue={search}
          onValueChange={onSearchChange}
          placeholder={t('search')}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Kind Select */}
        <div className="w-44">
          <Select
            selectedKey={resourceKind}
            onSelectionChange={(key) => onKindChange(String(key) as ResourceKind | 'all')}
            variant="secondary"
            className="w-full"
            aria-label={t('kind')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('kind')}>
                <ListBox.Item id="all" textValue={t('all')}>
                  {t('all')}
                </ListBox.Item>
                <ListBox.Item id="lecture_note" textValue={t('lecture_note')}>
                  {t('lecture_note')}
                </ListBox.Item>
                <ListBox.Item id="exam_sample" textValue={t('exam_sample')}>
                  {t('exam_sample')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Status Select */}
        <div className="w-44">
          <Select
            selectedKey={status}
            onSelectionChange={(key) => onStatusChange(String(key) as ResourceStatus | 'all')}
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
