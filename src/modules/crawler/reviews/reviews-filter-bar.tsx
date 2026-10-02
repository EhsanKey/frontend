'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import {
  SearchInput,
  SelectCampus,
  SelectMajor,
  SelectUniversity,
} from '@/components/shared';
import { useGetRequest } from '@/hooks';
import {
  clientCrawlerServices,
  type CrawlerMessageStatus,
  type TrackedChannelDto,
} from '@/apis/services/crawler';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface ReviewsFilterBarProps {
  search: string;
  status: CrawlerMessageStatus | 'all';
  confidence?: 'high' | 'medium' | 'low' | 'none' | 'all';
  matchFilter?: 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all';
  trackedChannelId?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CrawlerMessageStatus | 'all') => void;
  onConfidenceChange?: (value: 'high' | 'medium' | 'low' | 'none' | 'all') => void;
  onMatchFilterChange?: (value: 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all') => void;
  onTrackedChannelChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onClearFilters: () => void;
}

export const ReviewsFilterBar = ({
  search,
  status,
  confidence = 'all',
  matchFilter = 'all',
  trackedChannelId,
  universityId,
  campusId,
  majorId,
  onSearchChange,
  onStatusChange,
  onConfidenceChange,
  onMatchFilterChange,
  onTrackedChannelChange,
  onUniversityChange,
  onCampusChange,
  onMajorChange,
  onClearFilters,
}: ReviewsFilterBarProps) => {
  const t = useTranslations('crawler.reviews.filters');
  const tCommon = useTranslations('common');

  const { data: channelsData } = useGetRequest<PaginatedResult<TrackedChannelDto>>({
    queryKey: QUERY_KEYS.crawler.channelList({ pageSize: 100 }),
    requestFn: (signal) => clientCrawlerServices.getTrackedChannels({ pageSize: 100 }, signal),
    staleTime: 1000 * 60 * 5,
  });
  const channels = channelsData?.items || [];

  const hasActiveFilters = Boolean(
    search ||
      (status && status !== 'all') ||
      (confidence && confidence !== 'all') ||
      (matchFilter && matchFilter !== 'all') ||
      trackedChannelId ||
      universityId ||
      campusId ||
      majorId,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* 1. Search */}
        <div className="lg:col-span-2">
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={t('searchPlaceholder')}
          />
        </div>

        {/* 2. Match Percentage / Ambiguity Filter */}
        <div>
          <Select
            selectedKey={matchFilter}
            onSelectionChange={(key) =>
              onMatchFilterChange?.(
                String(key) as 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all',
              )
            }
            variant="secondary"
            className="w-full"
            aria-label="فیلتر درصد انطباق"
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue="همه درصدها">
                  همه درصدها
                </ListBox.Item>
                <ListBox.Item id="exact_100" textValue="تطبیق ۱۰۰٪ (دقیق)">
                  تطبیق ۱۰۰٪ (دقیق)
                </ListBox.Item>
                <ListBox.Item id="high_80" textValue="تطبیق بالای ۸۰٪">
                  تطبیق بالای ۸۰٪
                </ListBox.Item>
                <ListBox.Item id="ambiguous" textValue="⚠️ دروس همنام و مبهم">
                  ⚠️ دروس همنام و مبهم
                </ListBox.Item>
                <ListBox.Item id="low" textValue="تطبیق زیر ۸۰٪">
                  تطبیق زیر ۸۰٪
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 3. Review Likelihood / Confidence */}
        <div>
          <Select
            selectedKey={confidence}
            onSelectionChange={(key) =>
              onConfidenceChange?.(String(key) as 'high' | 'medium' | 'low' | 'none' | 'all')
            }
            variant="secondary"
            className="w-full"
            aria-label={t('likelihood')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue={t('allLikelihoods')}>
                  {t('allLikelihoods')}
                </ListBox.Item>
                <ListBox.Item id="high" textValue={t('highLikelihood')}>
                  {t('highLikelihood')}
                </ListBox.Item>
                <ListBox.Item id="medium" textValue={t('mediumLikelihood')}>
                  {t('mediumLikelihood')}
                </ListBox.Item>
                <ListBox.Item id="low" textValue={t('lowLikelihood')}>
                  {t('lowLikelihood')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 3. Status */}
        <div>
          <Select
            selectedKey={status}
            onSelectionChange={(key) =>
              onStatusChange(String(key) as CrawlerMessageStatus | 'all')
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
                <ListBox.Item id="pending" textValue={t('pending')}>
                  {t('pending')}
                </ListBox.Item>
                <ListBox.Item id="approved" textValue={t('approved')}>
                  {t('approved')}
                </ListBox.Item>
                <ListBox.Item id="rejected" textValue={t('rejected')}>
                  {t('rejected')}
                </ListBox.Item>
                <ListBox.Item id="ignored" textValue={t('ignored')}>
                  {t('ignored')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 4. Tracked Channel Filter */}
        <div>
          <Select
            selectedKey={trackedChannelId || 'all'}
            onSelectionChange={(key) =>
              onTrackedChannelChange(String(key) === 'all' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            aria-label={t('channel')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue={t('allChannels')}>
                  {t('allChannels')}
                </ListBox.Item>
                {channels.map((ch) => (
                  <ListBox.Item id={ch.id} key={ch.id} textValue={ch.title}>
                    {ch.title}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 4. University */}
        <SelectUniversity
          value={universityId}
          onChange={(uId) => {
            onUniversityChange(uId);
            onCampusChange('');
            onMajorChange('');
          }}
        />

        {/* 5. Campus */}
        <SelectCampus
          universityId={universityId}
          value={campusId}
          onChange={(cId) => {
            onCampusChange(cId);
            onMajorChange('');
          }}
        />

        {/* 6. Major */}
        <SelectMajor
          value={majorId}
          onChange={onMajorChange}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-neutral-500 hover:text-neutral-800 gap-1.5"
            onPress={onClearFilters}
          >
            <RotateCcw className={ICON_SIZE_CLASS.sm} />
            <span>{t('clearFilters')}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
