'use client';

import { Button, Chip } from '@heroui/react';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { IInquiryFollowUpItem, InquiryNotificationStatus } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface InquiriesTableProps {
  data?: PaginatedResult<IInquiryFollowUpItem> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onTriggerSingle?: (item: IInquiryFollowUpItem) => void;
}

type ColumnKey =
  | 'student'
  | 'professor'
  | 'course'
  | 'channel'
  | 'inquiredAt'
  | 'eligibleAt'
  | 'status'
  | 'actions';

export const InquiriesTable = ({
  data,
  isLoading,
  onPageChange,
  onTriggerSingle,
}: InquiriesTableProps) => {
  const t = useTranslations('inquiries.table');
  const tStatus = useTranslations('inquiries.status');
  const tChannel = useTranslations('inquiries.channel');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'student', label: t('student'), className: 'w-48', isRowHeader: true },
    { id: 'professor', label: t('professor'), className: 'w-44' },
    { id: 'course', label: t('course'), className: 'w-44' },
    { id: 'channel', label: t('channel'), className: 'w-28' },
    { id: 'inquiredAt', label: t('inquiredAt'), className: 'w-32', cellDir: 'ltr' },
    { id: 'eligibleAt', label: t('eligibleAt'), className: 'w-32', cellDir: 'ltr' },
    { id: 'status', label: t('status'), className: 'w-36' },
    { id: 'actions', label: t('actions'), className: 'w-24 text-center' },
  ];

  const renderStatusChip = (status: InquiryNotificationStatus, followUpCount = 0) => {
    switch (status) {
      case 'converted':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {tStatus('converted')}
          </Chip>
        );
      case 'opted_out':
        return (
          <Chip size="sm" variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
            {tStatus('opted_out')}
          </Chip>
        );
      case 'sent':
        return (
          <div className="flex items-center gap-1">
            <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
              {tStatus('sent')}
            </Chip>
            {followUpCount > 0 && (
              <span className="text-[10px] text-neutral-400 font-mono" title={`تعداد دفعات ارسال: ${followUpCount}`}>
                ({followUpCount}/2)
              </span>
            )}
          </div>
        );
      case 'failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {tStatus('failed')}
          </Chip>
        );
      case 'ignored':
        return (
          <Chip size="sm" variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">
            {tStatus('ignored')}
          </Chip>
        );
      case 'pending':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 font-medium">
            {tStatus('pending')}
          </Chip>
        );
    }
  };

  const renderCell = (
    item: IInquiryFollowUpItem,
    columnKey: ColumnKey,
  ) => {
    switch (columnKey) {
      case 'student':
        return (
          <div>
            <p className="font-bold text-neutral-900">
              {item.user.firstName || item.user.lastName
                ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim()
                : t('defaultStudentName')}
            </p>
            <p className="text-caption font-mono text-neutral-500">
              ID: {item.inquiry.telegramUserId}
              {item.user.username ? ` (@${item.user.username})` : ''}
            </p>
          </div>
        );
      case 'professor':
        return (
          <span className="font-semibold text-neutral-800">
            {item.professor.name}
          </span>
        );
      case 'course':
        return <span className="text-neutral-700">{item.course?.name || '—'}</span>;
      case 'channel':
        return (
          <span className="text-caption font-medium text-neutral-600">
            {item.inquiry.channel === 'group' ? tChannel('group') : tChannel('direct')}
          </span>
        );
      case 'inquiredAt':
        return (
          <span className="text-caption text-neutral-500">
            {formatPersianDate(item.inquiry.inquiredAt)}
          </span>
        );
      case 'eligibleAt':
        return (
          <span className="text-caption font-medium text-primary-700">
            {formatPersianDate(item.inquiry.followUpEligibleAt)}
          </span>
        );
      case 'status':
        return renderStatusChip(item.inquiry.notificationStatus);
      case 'actions':
        return (
          <div className="flex items-center justify-center">
            {item.inquiry.notificationStatus === 'pending' ||
            (item.inquiry.notificationStatus === 'sent' && (item.inquiry.followUpCount ?? 0) < 2) ? (
              onTriggerSingle ? (
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-primary-600 hover:bg-primary-50"
                  aria-label={t('sendFollowUpAria')}
                  onPress={() => onTriggerSingle(item)}
                >
                  <Send className={ICON_SIZE_CLASS.sm} />
                </Button>
              ) : (
                <span className="text-caption text-neutral-400">{t('waitingToSend')}</span>
              )
            ) : (
              <span className="text-caption text-neutral-400">{t('done')}</span>
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

export { TopicsTable } from './topics-table';
