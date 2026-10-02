'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import {
  SearchInput,
  SelectCampus,
  SelectMajor,
  SelectUniversity,
} from '@/components/shared';
import type { TrackedChannelStatus } from '@/apis/services/crawler';

interface ChannelsFilterBarProps {
  search: string;
  status: TrackedChannelStatus | 'all';
  universityId?: string;
  campusId?: string;
  majorId?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TrackedChannelStatus | 'all') => void;
  onUniversityChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onClearFilters: () => void;
}

export const ChannelsFilterBar = ({
  search,
  status,
  universityId,
  campusId,
  majorId,
  onSearchChange,
  onStatusChange,
  onUniversityChange,
  onCampusChange,
  onMajorChange,
  onClearFilters,
}: ChannelsFilterBarProps) => {
  const t = useTranslations('crawler.channels.filters');
  const tCommon = useTranslations('common');

  const hasActiveFilters = Boolean(
    search ||
      (status && status !== 'all') ||
      universityId ||
      campusId ||
      majorId,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Search */}
        <div className="lg:col-span-2">
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={t('searchPlaceholder')}
          />
        </div>

        {/* 2. Status */}
        <div>
          <Select
            selectedKey={status}
            onSelectionChange={(key) =>
              onStatusChange(String(key) as TrackedChannelStatus | 'all')
            }
            variant="secondary"
            className="w-full"
            aria-label={t('status')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue={t('allStatuses')}>
                  {t('allStatuses')}
                </ListBox.Item>
                <ListBox.Item id="active" textValue={t('statusActive')}>
                  {t('statusActive')}
                </ListBox.Item>
                <ListBox.Item id="paused" textValue={t('statusPaused')}>
                  {t('statusPaused')}
                </ListBox.Item>
                <ListBox.Item id="error" textValue={t('statusError')}>
                  {t('statusError')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 3. University */}
        <div>
          <SelectUniversity
            value={universityId}
            onChange={(uId) => {
              onUniversityChange(uId);
              onCampusChange('');
              onMajorChange('');
            }}
          />
        </div>

        {/* 4. Campus */}
        <div>
          <SelectCampus
            universityId={universityId}
            value={campusId}
            onChange={(cId) => {
              onCampusChange(cId);
              onMajorChange('');
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        {/* Major Filter */}
        <div className="w-full max-w-xs">
          <SelectMajor
            value={majorId}
            onChange={onMajorChange}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            className="text-neutral-500 hover:text-neutral-800 gap-1.5"
            onPress={onClearFilters}
          >
            <RotateCcw className={ICON_SIZE_CLASS.sm} />
            <span>{t('clearFilters')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
