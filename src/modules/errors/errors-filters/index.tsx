'use client';

import { ListBox, Select } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@/components/shared';
import type { ErrorLevel, ErrorSource } from '@/models';

interface ErrorsFiltersProps {
  search: string;
  source: ErrorSource | 'all';
  level: ErrorLevel | 'all';
  isResolved: 'all' | 'true' | 'false';
  onSearchChange: (value: string) => void;
  onSourceChange: (source: ErrorSource | 'all') => void;
  onLevelChange: (level: ErrorLevel | 'all') => void;
  onResolvedChange: (resolved: 'all' | 'true' | 'false') => void;
}

export const ErrorsFilters = ({
  search,
  source,
  level,
  isResolved,
  onSearchChange,
  onSourceChange,
  onLevelChange,
  onResolvedChange,
}: ErrorsFiltersProps) => {
  const t = useTranslations('errors.filters');
  const tSources = useTranslations('errors.sources');
  const tLevels = useTranslations('errors.levels');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 sm:max-w-xs">
        <SearchInput
          queryValue={search}
          onValueChange={onSearchChange}
          placeholder={t('search')}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Source Select */}
        <div className="w-48">
          <Select
            selectedKey={source}
            onSelectionChange={(key) => onSourceChange(String(key) as ErrorSource | 'all')}
            variant="secondary"
            className="w-full"
            aria-label={t('source')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('source')}>
                <ListBox.Item id="all" textValue={t('all')}>
                  {t('all')}
                </ListBox.Item>
                <ListBox.Item id="ai_planner" textValue={tSources('ai_planner')}>
                  {tSources('ai_planner')}
                </ListBox.Item>
                <ListBox.Item id="ai_answer" textValue={tSources('ai_answer')}>
                  {tSources('ai_answer')}
                </ListBox.Item>
                <ListBox.Item id="telegram" textValue={tSources('telegram')}>
                  {tSources('telegram')}
                </ListBox.Item>
                <ListBox.Item id="database" textValue={tSources('database')}>
                  {tSources('database')}
                </ListBox.Item>
                <ListBox.Item id="system" textValue={tSources('system')}>
                  {tSources('system')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Level Select */}
        <div className="w-36">
          <Select
            selectedKey={level}
            onSelectionChange={(key) => onLevelChange(String(key) as ErrorLevel | 'all')}
            variant="secondary"
            className="w-full"
            aria-label={t('level')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('level')}>
                <ListBox.Item id="all" textValue={t('all')}>
                  {t('all')}
                </ListBox.Item>
                <ListBox.Item id="fatal" textValue={tLevels('fatal')}>
                  {tLevels('fatal')}
                </ListBox.Item>
                <ListBox.Item id="error" textValue={tLevels('error')}>
                  {tLevels('error')}
                </ListBox.Item>
                <ListBox.Item id="warning" textValue={tLevels('warning')}>
                  {tLevels('warning')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Status Select */}
        <div className="w-36">
          <Select
            selectedKey={isResolved}
            onSelectionChange={(key) => onResolvedChange(String(key) as 'all' | 'true' | 'false')}
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
                <ListBox.Item id="false" textValue={t('unresolved')}>
                  {t('unresolved')}
                </ListBox.Item>
                <ListBox.Item id="true" textValue={t('resolved')}>
                  {t('resolved')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
