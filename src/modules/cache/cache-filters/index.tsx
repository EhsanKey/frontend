'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { SearchInput } from '@/components/shared';

interface CacheFiltersProps {
  search: string;
  intent: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onIntentChange: (intent: string) => void;
  onSortByChange: (sort: string) => void;
  onOpenInvalidateModal?: () => void;
  onOpenFlushModal?: () => void;
}

export const CacheFilters = ({
  search,
  intent,
  sortBy,
  onSearchChange,
  onIntentChange,
  onSortByChange,
  onOpenInvalidateModal,
  onOpenFlushModal,
}: CacheFiltersProps) => {
  const t = useTranslations('cache');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="flex-1 lg:max-w-md">
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={t('filters.searchPlaceholder')}
          />
        </div>

        {/* Action Buttons */}
        {(onOpenInvalidateModal || onOpenFlushModal) && (
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {onOpenInvalidateModal && (
              <Button
                variant="outline"
                onPress={onOpenInvalidateModal}
                className="flex items-center gap-1.5"
              >
                <RotateCcw className={ICON_SIZE_CLASS.sm} />
                <span>{t('actions.invalidate')}</span>
              </Button>
            )}

            {onOpenFlushModal && (
              <Button
                variant="danger"
                onPress={onOpenFlushModal}
                className="flex items-center gap-1.5"
              >
                <Trash2 className={ICON_SIZE_CLASS.sm} />
                <span>{t('actions.flush')}</span>
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-3">
        {/* Intent Select */}
        <div className="w-56">
          <Select
            selectedKey={intent}
            onSelectionChange={(key) => onIntentChange(String(key))}
            variant="secondary"
            className="w-full"
            aria-label={t('table.intent')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('table.intent')}>
                <ListBox.Item id="all" textValue={t('filters.allIntents')}>
                  {t('filters.allIntents')}
                </ListBox.Item>
                <ListBox.Item
                  id="summarize_professor_reviews"
                  textValue={t('filters.summarize_professor_reviews')}
                >
                  {t('filters.summarize_professor_reviews')}
                </ListBox.Item>
                <ListBox.Item
                  id="compare_professors_for_course"
                  textValue={t('filters.compare_professors_for_course')}
                >
                  {t('filters.compare_professors_for_course')}
                </ListBox.Item>
                <ListBox.Item
                  id="search_professors"
                  textValue={t('filters.search_professors')}
                >
                  {t('filters.search_professors')}
                </ListBox.Item>
                <ListBox.Item
                  id="find_course_resources"
                  textValue={t('filters.find_course_resources')}
                >
                  {t('filters.find_course_resources')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Sort By Select */}
        <div className="w-48">
          <Select
            selectedKey={sortBy}
            onSelectionChange={(key) => onSortByChange(String(key))}
            variant="secondary"
            className="w-full"
            aria-label={t('filters.sortBy')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('filters.sortBy')}>
                <ListBox.Item id="lastHitAt" textValue={t('filters.sortLastHit')}>
                  {t('filters.sortLastHit')}
                </ListBox.Item>
                <ListBox.Item id="hitCount" textValue={t('filters.sortHits')}>
                  {t('filters.sortHits')}
                </ListBox.Item>
                <ListBox.Item id="createdAt" textValue={t('filters.sortCreated')}>
                  {t('filters.sortCreated')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
