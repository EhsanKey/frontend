'use client';

import { Button, Chip } from '@heroui/react';
import { CheckCircle2, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDateTime } from '@/utils';
import type { ErrorLevel, ErrorSource, IErrorLog } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface ErrorsTableProps {
  data?: PaginatedResult<IErrorLog> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (error: IErrorLog) => void;
  onResolve?: (error: IErrorLog) => void;
}

type ColumnKey =
  | 'source'
  | 'level'
  | 'message'
  | 'status'
  | 'createdAt'
  | 'actions';

export const ErrorsTable = ({
  data,
  isLoading,
  onPageChange,
  onViewDetails,
  onResolve,
}: ErrorsTableProps) => {
  const tMain = useTranslations('errors');
  const t = useTranslations('errors.table');
  const tSources = useTranslations('errors.sources');
  const tLevels = useTranslations('errors.levels');
  const tStatuses = useTranslations('errors.statuses');
  const tActions = useTranslations('errors.actions');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'source', label: t('source'), className: 'w-44' },
    { id: 'level', label: t('level'), className: 'w-28' },
    { id: 'message', label: t('message'), isRowHeader: true },
    { id: 'status', label: t('status'), className: 'w-32' },
    { id: 'createdAt', label: t('createdAt'), className: 'w-44', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-28 text-center' },
  ];

  const renderSourceChip = (source: ErrorSource) => {
    return (
      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-caption font-semibold text-neutral-700">
        {tSources(source)}
      </span>
    );
  };

  const renderLevelChip = (level: ErrorLevel) => {
    switch (level) {
      case 'fatal':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-100 text-danger-800 font-bold">
            {tLevels('fatal')}
          </Chip>
        );
      case 'error':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {tLevels('error')}
          </Chip>
        );
      case 'warning':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 font-medium">
            {tLevels('warning')}
          </Chip>
        );
    }
  };

  const renderCell = (item: IErrorLog, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'source':
        return renderSourceChip(item.source);
      case 'level':
        return renderLevelChip(item.level);
      case 'message':
        return (
          <div className="max-w-md">
            <p className="line-clamp-2 font-mono text-body-sm text-neutral-800 leading-relaxed" dir="ltr">
              {item.message}
            </p>
          </div>
        );
      case 'status':
        return item.isResolved ? (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
            {tStatuses('resolved')}
          </Chip>
        ) : (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {tStatuses('unresolved')}
          </Chip>
        );
      case 'createdAt':
        return (
          <span className="text-caption font-mono text-neutral-600 whitespace-nowrap" dir="ltr">
            {formatPersianDateTime(item.createdAt)}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="text-primary-600 hover:bg-primary-50"
              aria-label={tActions('viewDetails')}
              onPress={() => onViewDetails(item)}
            >
              <Eye className={ICON_SIZE_CLASS.sm} />
            </Button>
            {!item.isResolved && onResolve ? (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-success-600 hover:bg-success-50"
                aria-label={tActions('resolve')}
                onPress={() => onResolve(item)}
              >
                <CheckCircle2 className={ICON_SIZE_CLASS.sm} />
              </Button>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer
      ariaLabel={tMain('title')}
      headerCells={headers}
      items={data?.items ?? []}
      isLoading={isLoading}
      renderCell={renderCell}
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
