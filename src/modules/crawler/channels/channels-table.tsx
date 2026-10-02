'use client';

import { Button, Chip } from '@heroui/react';
import {
  Lock,
  Pause,
  Play,
  Radio,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  BackfillStatus,
  TrackedChannelDto,
  TrackedChannelStatus,
} from '@/apis/services/crawler';

interface ChannelsTableProps {
  data?: PaginatedResult<TrackedChannelDto> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onTriggerSync?: (channel: TrackedChannelDto) => void;
  onToggleStatus?: (channel: TrackedChannelDto) => void;
  onDelete?: (channel: TrackedChannelDto) => void;
}

type ColumnKey =
  | 'channel'
  | 'academic'
  | 'major'
  | 'status'
  | 'backfillStatus'
  | 'collectedCount'
  | 'detectedReviews'
  | 'approvedReviews'
  | 'lastSync'
  | 'actions';

export const ChannelsTable = ({
  data,
  isLoading,
  onPageChange,
  onTriggerSync,
  onToggleStatus,
  onDelete,
}: ChannelsTableProps) => {
  const t = useTranslations('crawler.channels.table');
  const tFilters = useTranslations('crawler.channels.filters');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'channel', label: t('channel'), className: 'w-52', isRowHeader: true },
    { id: 'academic', label: t('academicScope'), className: 'w-44' },
    { id: 'major', label: t('major'), className: 'w-32' },
    { id: 'status', label: t('status'), className: 'w-24' },
    { id: 'backfillStatus', label: t('backfillStatus'), className: 'w-32' },
    { id: 'collectedCount', label: t('collectedCount'), className: 'w-28 text-center' },
    { id: 'detectedReviews', label: t('detectedReviews'), className: 'w-32 text-center' },
    { id: 'approvedReviews', label: t('approvedReviews'), className: 'w-24 text-center' },
    { id: 'lastSync', label: t('lastSync'), className: 'w-32', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-32 text-center' },
  ];

  const renderStatusChip = (status: TrackedChannelStatus) => {
    switch (status) {
      case 'active':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 border border-success-200">
            {tFilters('statusActive')}
          </Chip>
        );
      case 'paused':
        return (
          <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
            {tFilters('statusPaused')}
          </Chip>
        );
      case 'error':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 border border-danger-200">
            {tFilters('statusError')}
          </Chip>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const renderBackfillChip = (status: BackfillStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <Chip size="sm" variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
            {t('backfill_in_progress')}
          </Chip>
        );
      case 'completed':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 border border-success-200">
            {t('backfill_completed')}
          </Chip>
        );
      case 'failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 border border-danger-200">
            {t('backfill_failed')}
          </Chip>
        );
      case 'idle':
      default:
        return (
          <span className="text-caption text-neutral-400">{t('backfill_idle')}</span>
        );
    }
  };

  const renderCell = (item: TrackedChannelDto, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'channel':
        return (
          <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-neutral-900 text-body-sm font-bold">
                {item.title}
              </span>
              {item.isPrivate && (
                <Chip size="sm" variant="secondary" className="bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] px-1 py-0 h-4 gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{t('privateChannel')}</span>
                </Chip>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono" dir="ltr">
              {item.username ? (
                <span className="text-primary-600">@{item.username}</span>
              ) : (
                <span>{item.telegramChannelId}</span>
              )}
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm font-medium text-neutral-800">
              {item.universityName || '-'}
            </span>
            <span className="text-caption text-neutral-500">
              {item.campusName || '-'}
            </span>
          </div>
        );

      case 'major':
        return (
          <span className="text-body-sm text-neutral-700">
            {item.majorName || t('allMajors')}
          </span>
        );

      case 'status':
        return renderStatusChip(item.status);

      case 'backfillStatus':
        return renderBackfillChip(item.backfillStatus);

      case 'collectedCount':
        return (
          <div className="flex flex-col items-center">
            <span className="text-body-sm font-bold text-neutral-900 font-mono">
              {(item.totalMessagesCollected || 0).toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-neutral-400">{t('messagesUnit')}</span>
          </div>
        );

      case 'detectedReviews': {
        const detected = item.detectedReviewsCount ?? 0;
        const total = item.totalMessagesCollected ?? 0;
        const pct = total > 0 ? Math.round((detected / total) * 100) : 0;
        return (
          <div className="flex flex-col items-center">
            <span className="text-body-sm font-bold text-primary-700 font-mono">
              {detected.toLocaleString('fa-IR')}
            </span>
            {total > 0 && (
              <span className="text-[10px] text-primary-600/80">
                ({pct.toLocaleString('fa-IR')}٪ نظر)
              </span>
            )}
          </div>
        );
      }

      case 'approvedReviews': {
        const approved = item.approvedReviewsCount ?? 0;
        return (
          <div className="flex flex-col items-center">
            <span className="text-body-sm font-bold text-success-700 font-mono">
              {approved.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-success-600/80">تایید شده</span>
          </div>
        );
      }

      case 'lastSync':
        return (
          <span className="text-caption text-neutral-500">
            {item.lastSyncAt ? formatPersianDate(item.lastSyncAt) : t('neverSynced')}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            {/* Sync Button */}
            {onTriggerSync && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-500 hover:text-primary-600"
                aria-label={t('triggerSync')}
                onPress={() => onTriggerSync(item)}
              >
                <RotateCw className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}

            {/* Toggle Status Button */}
            {onToggleStatus && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className={
                  item.status === 'active'
                    ? 'text-neutral-500 hover:text-amber-600'
                    : 'text-neutral-500 hover:text-success-600'
                }
                aria-label={item.status === 'active' ? t('pause') : t('resume')}
                onPress={() => onToggleStatus(item)}
              >
                {item.status === 'active' ? (
                  <Pause className={ICON_SIZE_CLASS.sm} />
                ) : (
                  <Play className={ICON_SIZE_CLASS.sm} />
                )}
              </Button>
            )}

            {/* Delete Button */}
            {onDelete && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-400 hover:text-danger-600"
                aria-label={t('delete')}
                onPress={() => onDelete(item)}
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
      ariaLabel={t('ariaLabel')}
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
