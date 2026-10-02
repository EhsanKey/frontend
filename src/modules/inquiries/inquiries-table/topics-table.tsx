'use client';

import React from 'react';
import { Button, Chip } from '@heroui/react';
import {
  BookOpen,
  CheckCircle2,
  Edit,
  GitMerge,
  GraduationCap,
  Layers,
  Send,
  Trash2,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { IInquiryTopic, InquiryTopicStatus } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface TopicsTableProps {
  data?: PaginatedResult<IInquiryTopic> | null;
  isLoading?: boolean;
  selectedTopicIds: string[];
  onToggleSelectTopic: (id: string) => void;
  onSelectAllTopics: (selected: boolean) => void;
  onPageChange: (page: number) => void;
  onViewAliases: (topic: IInquiryTopic) => void;
  onEditTopic?: (topic: IInquiryTopic) => void;
  onMergeTopic?: (topic: IInquiryTopic) => void;
  onSendCampaign?: (topic: IInquiryTopic) => void;
  onDeleteTopic?: (topic: IInquiryTopic) => void;
}

type ColumnKey =
  | 'select'
  | 'topic'
  | 'linkedEntity'
  | 'aliases'
  | 'students'
  | 'conversion'
  | 'status'
  | 'actions';

export const TopicsTable: React.FC<TopicsTableProps> = ({
  data,
  isLoading,
  selectedTopicIds,
  onToggleSelectTopic,
  onSelectAllTopics,
  onPageChange,
  onViewAliases,
  onEditTopic,
  onMergeTopic,
  onSendCampaign,
  onDeleteTopic,
}) => {
  const t = useTranslations('inquiries.table');
  const tStatus = useTranslations('inquiries.status');

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((i) => selectedTopicIds.includes(i.id));

  const headers: TableHeaderOptions<ColumnKey>[] = [
    {
      id: 'select',
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAllTopics(e.target.checked)}
          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          aria-label="انتخاب همه"
        />
      ),
      className: 'w-12 text-center',
    },
    { id: 'topic', label: t('topic'), className: 'w-48', isRowHeader: true },
    { id: 'linkedEntity', label: t('linkedEntity'), className: 'w-48' },
    { id: 'aliases', label: t('aliases'), className: 'w-64' },
    { id: 'students', label: t('studentsCount'), className: 'w-36 text-center' },
    { id: 'conversion', label: t('conversionRate'), className: 'w-32 text-center' },
    { id: 'status', label: t('status'), className: 'w-28 text-center' },
    { id: 'actions', label: t('actions'), className: 'w-32 text-center' },
  ];

  const renderStatusChip = (status: InquiryTopicStatus) => {
    switch (status) {
      case 'active':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
            {tStatus('active')}
          </Chip>
        );
      case 'resolved':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
            {tStatus('resolved')}
          </Chip>
        );
      case 'archived':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-neutral-100 text-neutral-600 font-medium">
            {tStatus('archived')}
          </Chip>
        );
    }
  };

  const renderCell = (item: IInquiryTopic, columnKey: ColumnKey) => {
    const isSelected = selectedTopicIds.includes(item.id);

    switch (columnKey) {
      case 'select':
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelectTopic(item.id)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              aria-label={`انتخاب ${item.canonicalName}`}
            />
          </div>
        );

      case 'topic':
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
              {item.topicType === 'professor' ? (
                <GraduationCap className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-neutral-900 dark:text-neutral-50 truncate">
                {item.canonicalName}
              </p>
              <p className="text-caption text-neutral-400 font-mono">
                {item.totalQueries} {t('queriesCount')}
              </p>
            </div>
          </div>
        );

      case 'linkedEntity':
        if (item.professor) {
          return (
            <div className="flex items-center gap-1.5 text-xs text-primary-700 dark:text-primary-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-600 shrink-0" />
              <span className="truncate">{item.professor.name}</span>
            </div>
          );
        }
        if (item.course) {
          return (
            <div className="flex items-center gap-1.5 text-xs text-secondary-700 dark:text-secondary-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-600 shrink-0" />
              <span className="truncate">{item.course.name}</span>
            </div>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            {t('unlinked')}
          </span>
        );

      case 'aliases': {
        const aliases = item.aliases || [];
        const displayAliases = aliases.slice(0, 3);
        const remainder = aliases.length - 3;

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {displayAliases.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
                title={`تعداد پرسش: ${a.queryCount} بار`}
              >
                <span>{a.rawAlias}</span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  - {a.studentCount !== undefined ? a.studentCount : a.queryCount} نفر
                </span>
              </span>
            ))}
            {remainder > 0 && (
              <span className="text-[11px] text-primary-600 font-medium">
                {t('moreAliases', { count: remainder })}
              </span>
            )}
            {aliases.length === 0 && (
              <span className="text-caption text-neutral-400">—</span>
            )}
          </div>
        );
      }

      case 'students': {
        const round1 = item.round1PendingCount ?? item.pendingInquiriesCount ?? 0;
        const round2 = item.round2PendingCount ?? 0;
        const totalPending = round1 + round2;

        return (
          <div
            className="flex flex-col items-center justify-center gap-0.5"
            title={`کل دانشجویان: ${item.uniqueStudentsCount} نفر | مرحله ۱: ${round1} نفر | مرحله ۲: ${round2} نفر`}
          >
            <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>{item.uniqueStudentsCount}</span>
            </div>
            {totalPending > 0 ? (
              <div className="flex items-center gap-1 mt-0.5">
                {round1 > 0 && (
                  <span
                    className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1 py-0.2 rounded"
                    title={`مرحله ۱ (پیگیری اولیه): ${round1} نفر`}
                  >
                    {round1} د۱
                  </span>
                )}
                {round2 > 0 && (
                  <span
                    className="text-[10px] font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 px-1 py-0.2 rounded"
                    title={`مرحله ۲ (یادآوری): ${round2} نفر`}
                  >
                    {round2} د۲
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] text-neutral-400">تکمیل شده</span>
            )}
          </div>
        );
      }

      case 'conversion':
        return (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span
              className={`text-xs font-bold ${
                item.conversionRate > 20
                  ? 'text-success-600'
                  : item.conversionRate > 0
                  ? 'text-primary-600'
                  : 'text-neutral-400'
              }`}
            >
              {item.conversionRate}%
            </span>
            <span className="text-[10px] text-neutral-400">
              {item.convertedInquiriesCount} نظر
              {item.optedOutInquiriesCount && item.optedOutInquiriesCount > 0
                ? ` • ${item.optedOutInquiriesCount} انصراف`
                : ''}
            </span>
          </div>
        );

      case 'status':
        return (
          <div className="flex items-center justify-center">
            {renderStatusChip(item.status)}
          </div>
        );

      case 'actions': {
        const totalActionable =
          (item.round1PendingCount ?? item.pendingInquiriesCount ?? 0) +
          (item.round2PendingCount ?? 0);

        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="text-neutral-600 hover:text-primary-600"
              aria-label={t('viewAliases')}
              onPress={() => onViewAliases(item)}
            >
              <Layers className={ICON_SIZE_CLASS.sm} />
            </Button>

            {onEditTopic && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-600 hover:text-primary-600"
                aria-label={t('editTopic')}
                onPress={() => onEditTopic(item)}
              >
                <Edit className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}

            {onMergeTopic && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-600 hover:text-secondary-600"
                aria-label={t('mergeTopic')}
                onPress={() => onMergeTopic(item)}
              >
                <GitMerge className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}

            {onSendCampaign && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-primary-600 hover:bg-primary-50"
                aria-label={t('sendCampaign')}
                isDisabled={totalActionable === 0}
                onPress={() => onSendCampaign(item)}
              >
                <Send className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}

            {onDeleteTopic && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                aria-label="حذف سرگروه"
                onPress={() => onDeleteTopic(item)}
              >
                <Trash2 className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <TableContainer
      ariaLabel={t('title')}
      headerCells={headers}
      items={items}
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
