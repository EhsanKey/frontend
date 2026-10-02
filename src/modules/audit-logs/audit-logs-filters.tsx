'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchInput } from '@/components/shared';
import { useQueryState } from '@/hooks';

const DOMAIN_KEYS = [
  'all',
  'teachings',
  'professors',
  'courses',
  'campuses',
  'universities',
  'majors',
  'reviews',
  'resources',
  'users',
  'auth',
  'system',
] as const;

const ACTION_KEYS = [
  'all',
  'CREATE',
  'UPDATE',
  'DELETE',
  'MERGE',
  'LOGIN',
  'APPROVE',
  'REJECT',
  'INVALIDATE',
] as const;

export const AuditLogsFilters = () => {
  const t = useTranslations('auditLogs');
  const { getQuery, updateQueries } = useQueryState();

  const search = getQuery('search') ?? '';
  const domain = getQuery('domain') ?? 'all';
  const action = getQuery('action') ?? 'all';

  const hasActiveFilters = Boolean(search || domain !== 'all' || action !== 'all');

  const handleReset = () => {
    updateQueries({
      search: null,
      domain: null,
      action: null,
      page: null,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            queryValue={search}
            onValueChange={(val) => {
              updateQueries({ search: val || null, page: null });
            }}
            placeholder={t('filters.search')}
          />
        </div>

        {/* Domain Filter */}
        <div className="w-full sm:w-44">
          <Select
            selectedKey={domain}
            onSelectionChange={(key) =>
              updateQueries({
                domain: key === 'all' ? null : String(key),
                page: null,
              })
            }
            variant="secondary"
            className="w-full"
            aria-label={t('filters.domain')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('filters.domain')}>
                {DOMAIN_KEYS.map((k) => {
                  const label = k === 'all' ? t('filters.allDomains') : t(`domains.${k}`);
                  return (
                    <ListBox.Item key={k} id={k} textValue={label}>
                      {label}
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Action Filter */}
        <div className="w-full sm:w-44">
          <Select
            selectedKey={action}
            onSelectionChange={(key) =>
              updateQueries({
                action: key === 'all' ? null : String(key),
                page: null,
              })
            }
            variant="secondary"
            className="w-full"
            aria-label={t('filters.action')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('filters.action')}>
                {ACTION_KEYS.map((k) => {
                  const label =
                    k === 'all'
                      ? t('filters.allActions')
                      : `${t(`actions.${k}`)} (${k})`;
                  return (
                    <ListBox.Item key={k} id={k} textValue={label}>
                      {label}
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onPress={handleReset}
          className="gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 shrink-0 self-end md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('filters.reset')}
        </Button>
      )}
    </div>
  );
};

export default AuditLogsFilters;
