'use client';

import React from 'react';
import { Button, Chip } from '@heroui/react';
import { Eye, RotateCcw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { IBroadcastCampaign } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface BroadcastsTableProps {
  data?: PaginatedResult<IBroadcastCampaign> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (campaign: IBroadcastCampaign) => void;
  onRetry: (campaign: IBroadcastCampaign) => void;
  onDelete: (campaign: IBroadcastCampaign) => void;
}

type ColumnKey =
  | 'title'
  | 'target'
  | 'stats'
  | 'status'
  | 'createdAt'
  | 'actions';

export const BroadcastsTable: React.FC<BroadcastsTableProps> = ({
  data,
  isLoading,
  onPageChange,
  onViewDetails,
  onRetry,
  onDelete,
}) => {
  const t = useTranslations('broadcasts');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'title', label: t('columns.title'), className: 'w-72', isRowHeader: true },
    { id: 'target', label: t('columns.target'), className: 'w-48' },
    { id: 'stats', label: t('columns.stats'), className: 'w-48' },
    { id: 'status', label: t('columns.status'), className: 'w-32' },
    { id: 'createdAt', label: t('columns.createdAt'), className: 'w-36', cellDir: 'ltr' },
    { id: 'actions', label: t('columns.actions'), className: 'w-32 text-center' },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700">
            {t('statuses.completed')}
          </Chip>
        );
      case 'sending':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700">
            {t('statuses.sending')}
          </Chip>
        );
      case 'partially_failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700">
            {t('statuses.partially_failed')}
          </Chip>
        );
      case 'failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700">
            {t('statuses.failed')}
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-default-100 text-default-700">
            {t('statuses.draft')}
          </Chip>
        );
    }
  };

  const renderTargetLabel = (campaign: IBroadcastCampaign) => {
    const f = campaign.targetFilters;
    if (f.targetType === 'all') {
      return (
        <span className="text-xs font-medium text-foreground">
          {t('table.allUsers')}
        </span>
      );
    }

    const filtersApplied: string[] = [];
    if (f.universityId) filtersApplied.push(t('table.selectedUniversity'));
    if (f.campusId) filtersApplied.push(t('table.campus'));
    if (f.majorId) filtersApplied.push(t('table.major'));
    if (f.joinedFrom || f.joinedTo) filtersApplied.push(t('table.dateRange'));

    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-primary">{t('table.customFilter')}</span>
        <span className="text-[10px] text-default-400">
          {filtersApplied.length > 0 ? filtersApplied.join(' • ') : t('table.customFilterDefault')}
        </span>
      </div>
    );
  };

  const renderCell = (item: IBroadcastCampaign, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'title':
        return (
          <div className="flex flex-col gap-1 max-w-[280px]">
            <span className="font-semibold text-foreground truncate">{item.title}</span>
            <span className="text-xs text-default-400 truncate line-clamp-1">
              {item.messageText.replace(/<[^>]*>?/gm, '')}
            </span>
          </div>
        );

      case 'target':
        return renderTargetLabel(item);

      case 'stats': {
        const percent = item.totalTargets > 0
          ? Math.round((item.successfulCount / item.totalTargets) * 100)
          : 0;
        return (
          <div className="flex flex-col gap-1 w-full max-w-[160px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-success-600 font-medium">
                {t('table.successfulCount', { count: item.successfulCount.toLocaleString('fa-IR') })}
              </span>
              {item.failedCount > 0 && (
                <span className="text-danger-600 font-medium">
                  {t('table.failedCount', { count: item.failedCount.toLocaleString('fa-IR') })}
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-default-100 rounded-full overflow-hidden flex">
              <div
                className="bg-success-500 h-full"
                style={{ width: `${percent}%` }}
              />
              {item.failedCount > 0 && (
                <div
                  className="bg-danger-500 h-full"
                  style={{
                    width: `${Math.round((item.failedCount / item.totalTargets) * 100)}%`,
                  }}
                />
              )}
            </div>
          </div>
        );
      }

      case 'status':
        return renderStatus(item.status);

      case 'createdAt':
        return (
          <span className="text-xs text-default-500">
            {formatPersianDate(item.createdAt)}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-default-600 hover:text-primary"
              aria-label={t('actions.viewDetails')}
              onPress={() => onViewDetails(item)}
            >
              <Eye className="w-4 h-4" />
            </Button>

            {item.failedCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-warning-600 hover:text-warning-700"
                aria-label={t('actions.retryCampaign')}
                onPress={() => onRetry(item)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-danger-500 hover:text-danger-600"
              aria-label={t('actions.deleteCampaign')}
              onPress={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TableContainer<IBroadcastCampaign, ColumnKey>
      ariaLabel={t('table.ariaLabel')}
      headerCells={headers}
      items={data?.items || []}
      isLoading={isLoading}
      renderCell={renderCell}
      pagination={
        data?.meta
          ? {
              ...data.meta,
              onPageChange,
            }
          : undefined
      }
      emptyComponent={
        <div className="py-8 text-center text-default-500">
          {t('table.empty')}
        </div>
      }
    />
  );
};
