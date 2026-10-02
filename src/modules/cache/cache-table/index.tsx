'use client';

import { Button, Chip } from '@heroui/react';
import { Eye, GraduationCap, Layers, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { IAiCacheEntry } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface CacheTableProps {
  data?: PaginatedResult<IAiCacheEntry> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (entry: IAiCacheEntry) => void;
  onDeleteEntry?: (entry: IAiCacheEntry) => void;
}

type ColumnKey =
  | 'target'
  | 'intent'
  | 'hits'
  | 'lastHit'
  | 'preview'
  | 'actions';

export const CacheTable = ({
  data,
  isLoading,
  onPageChange,
  onViewDetails,
  onDeleteEntry,
}: CacheTableProps) => {
  const t = useTranslations('cache');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'target', label: t('table.target'), isRowHeader: true, className: 'w-64' },
    { id: 'intent', label: t('table.intent'), className: 'w-48' },
    { id: 'hits', label: t('table.hits'), className: 'w-28 text-center' },
    { id: 'lastHit', label: t('table.lastHit'), className: 'w-32' },
    { id: 'preview', label: t('table.preview') },
    { id: 'actions', label: t('table.actions'), className: 'w-24 text-center' },
  ];

  const renderIntentBadge = (intent: string) => {
    switch (intent) {
      case 'summarize_professor_reviews':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {t('filters.summarize_professor_reviews')}
          </Chip>
        );
      case 'compare_professors_for_course':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {t('filters.compare_professors_for_course')}
          </Chip>
        );
      case 'search_professors':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {t('filters.search_professors')}
          </Chip>
        );
      case 'find_course_resources':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {t('filters.find_course_resources')}
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-neutral-100 text-neutral-700 font-medium">
            {intent}
          </Chip>
        );
    }
  };

  const renderCell = (item: IAiCacheEntry, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'target':
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-medium text-neutral-900">
              {item.professor ? (
                <>
                  <GraduationCap className={`text-primary-600 ${ICON_SIZE_CLASS.sm}`} />
                  <span className="truncate">{item.professor.name}</span>
                </>
              ) : item.course ? (
                <>
                  <Layers className={`text-secondary-600 ${ICON_SIZE_CLASS.sm}`} />
                  <span className="truncate">{item.course.name}</span>
                </>
              ) : (
                <span className="text-neutral-500">{t('table.publicTarget')}</span>
              )}
            </div>
            <span
              className="line-clamp-1 font-mono text-caption text-neutral-400"
              dir="ltr"
              title={item.cacheKey}
            >
              {item.cacheKey}
            </span>
          </div>
        );

      case 'intent':
        return renderIntentBadge(item.intent);

      case 'hits':
        return (
          <div className="text-center">
            <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 font-mono text-body-sm font-semibold text-neutral-700">
              {item.hitCount.toLocaleString('fa-IR')}
            </span>
          </div>
        );

      case 'lastHit':
        return (
          <span className="text-caption text-neutral-600" dir="ltr">
            {item.lastHitAt ? formatPersianDate(item.lastHitAt) : '-'}
          </span>
        );

      case 'preview':
        return (
          <div className="max-w-md">
            <p className="line-clamp-2 text-body-sm text-neutral-700 leading-relaxed">
              {item.answerPreview || item.answerText}
            </p>
          </div>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              isIconOnly
              onPress={() => onViewDetails(item)}
              aria-label={t('actions.viewDetails')}
            >
              <Eye className={ICON_SIZE_CLASS.sm} />
            </Button>
            {onDeleteEntry && (
              <Button
                variant="ghost"
                isIconOnly
                onPress={() => onDeleteEntry(item)}
                aria-label={t('actions.delete')}
                className="text-danger-600 hover:text-danger-700"
              >
                <Trash2 className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TableContainer
      ariaLabel={t('title')}
      headerCells={headers}
      items={data?.items ?? []}
      renderCell={renderCell}
      isLoading={isLoading}
      pagination={
        data?.meta
          ? {
              page: data.meta.page,
              perPage: data.meta.perPage,
              total: data.meta.total,
              totalPages: data.meta.totalPages,
              onPageChange,
            }
          : undefined
      }
    />
  );
};
