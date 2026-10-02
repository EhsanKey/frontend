'use client';

import { Button, Chip } from '@heroui/react';
import {
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  CrawlerMessageDto,
  CrawlerMessageStatus,
} from '@/apis/services/crawler';

interface ReviewsTableProps {
  data?: PaginatedResult<CrawlerMessageDto> | null;
  isLoading?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (selected: boolean) => void;
  onPageChange: (page: number) => void;
  onModerate: (message: CrawlerMessageDto) => void;
  onReject: (message: CrawlerMessageDto) => void;
  onDelete?: (message: CrawlerMessageDto) => void;
  onBulkDelete?: () => void;
}

type ColumnKey =
  | 'select'
  | 'channel'
  | 'content'
  | 'probability'
  | 'academic'
  | 'entityMapping'
  | 'status'
  | 'actions';

export const ReviewsTable = ({
  data,
  isLoading,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onPageChange,
  onModerate,
  onReject,
  onDelete,
  onBulkDelete,
}: ReviewsTableProps) => {
  const t = useTranslations('crawler.reviews.table');
  const tFilters = useTranslations('crawler.reviews.filters');

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  const headers: TableHeaderOptions<ColumnKey>[] = [
    {
      id: 'select',
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll?.(e.target.checked)}
          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer h-4 w-4"
          aria-label={t('selectAll')}
        />
      ),
      className: 'w-12 text-center',
    },
    { id: 'channel', label: t('sourceChannel'), className: 'w-52', isRowHeader: true },
    { id: 'content', label: t('content') },
    { id: 'probability', label: t('reviewProbability'), className: 'w-48' },
    { id: 'academic', label: t('academicScope'), className: 'w-44' },
    { id: 'entityMapping', label: t('professorAndCourse'), className: 'w-44' },
    { id: 'status', label: t('status'), className: 'w-28' },
    { id: 'actions', label: t('actions'), className: 'w-36 text-center' },
  ];

  const getDimensionLabel = (dim: string) => {
    switch (dim) {
      case 'teaching':
        return t('dim_teaching');
      case 'grading':
        return t('dim_grading');
      case 'exam':
        return t('dim_exam');
      case 'attendance':
        return t('dim_attendance');
      case 'personality':
        return t('dim_personality');
      case 'project_homework':
        return t('dim_project_homework');
      default:
        return dim;
    }
  };

  const renderStatusChip = (status: CrawlerMessageStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 border border-success-200">
            {tFilters('approved')}
          </Chip>
        );
      case 'rejected':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 border border-danger-200">
            {tFilters('rejected')}
          </Chip>
        );
      case 'ignored':
        return (
          <Chip size="sm" variant="secondary" className="bg-neutral-100 text-neutral-600 border border-neutral-200">
            {tFilters('ignored')}
          </Chip>
        );
      case 'pending':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
            {tFilters('pending')}
          </Chip>
        );
    }
  };

  const renderProbabilityBadge = (item: CrawlerMessageDto) => {
    const evalData = item.rawMetadata?.reviewEvaluation;
    if (!evalData) {
      return (
        <span className="text-caption text-neutral-400">-</span>
      );
    }

    const pct = evalData.percentage ?? 0;
    let badgeColor = 'bg-neutral-100 text-neutral-600 border-neutral-200';
    let likelihoodLabel = '';

    if (pct >= 80) {
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      likelihoodLabel = 'قطعی';
    } else if (pct >= 60) {
      badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
      likelihoodLabel = 'محتمل';
    } else if (pct >= 30) {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
      likelihoodLabel = 'پایین';
    } else {
      badgeColor = 'bg-neutral-100 text-neutral-600 border-neutral-200';
      likelihoodLabel = 'متفرقه';
    }

    return (
      <div className="flex flex-col gap-1.5 items-start">
        <div className="flex items-center gap-1.5">
          <Chip size="sm" variant="secondary" className={`${badgeColor} border font-bold text-[11px] h-6 px-1.5`}>
            {pct.toLocaleString('fa-IR')}٪
          </Chip>
          {likelihoodLabel && (
            <span className="text-[11px] text-neutral-600 font-medium">({likelihoodLabel})</span>
          )}
        </div>

        {evalData.detectedDimensions && evalData.detectedDimensions.length > 0 && (
          <div className="flex flex-wrap gap-1 max-w-[190px]">
            {evalData.detectedDimensions.slice(0, 3).map((dim) => (
              <span
                key={dim}
                className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700 border border-neutral-200"
              >
                {getDimensionLabel(dim)}
              </span>
            ))}
            {evalData.detectedDimensions.length > 3 && (
              <span className="text-[10px] text-neutral-400">
                +{evalData.detectedDimensions.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCell = (item: CrawlerMessageDto, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'select':
        return (
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggleSelect?.(item.id)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer h-4 w-4"
              aria-label={`انتخاب پیام ${item.id}`}
            />
          </div>
        );

      case 'channel':
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-body-sm font-bold text-neutral-800">
              {item.channelTitle || t('telegramChannelDefault')}
            </span>
            <div className="flex items-center gap-1.5 text-caption text-neutral-500">
              <span>{formatPersianDate(item.messageDate)}</span>
              {item.authorName && (
                <span className="text-[11px] text-neutral-400">({item.authorName})</span>
              )}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="max-w-md">
            <p className="line-clamp-2 text-body-sm text-neutral-800 leading-relaxed font-normal">
              {item.content}
            </p>
            {item.rejectionReason && (
              <p className="mt-1 text-caption text-danger-600">
                {t('rejectionReasonPrefix', { reason: item.rejectionReason ?? '' })}
              </p>
            )}
          </div>
        );

      case 'probability':
        return renderProbabilityBadge(item);

      case 'academic':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm font-medium text-neutral-800">
              {item.universityName || '-'}
            </span>
            <span className="text-caption text-neutral-500">
              {item.campusName || '-'} {item.majorName ? `• ${item.majorName}` : ''}
            </span>
          </div>
        );

      case 'entityMapping': {
        const extraction = (item.rawMetadata as any)?.extraction;
        const profRes = extraction?.professorResolution;
        const crsRes = extraction?.courseResolution;
        const profName = item.existingProfessorName || item.professorName || profRes?.matchedName;
        const crsName = item.existingCourseName || item.courseName || crsRes?.matchedName;

        return (
          <div className="flex flex-col gap-1.5 items-start">
            {profName ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-body-sm font-medium text-primary-700">
                  {t('professorPrefix', { name: profName })}
                </span>
                {profRes?.score > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      profRes.matchType === 'database'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {profRes.score}٪
                  </span>
                )}
              </div>
            ) : null}

            {crsName ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-caption text-neutral-600">
                  {t('coursePrefix', { name: crsName })}
                </span>
                {crsRes?.score > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      crsRes.matchType === 'database'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {crsRes.score}٪
                  </span>
                )}
                {crsRes?.isAmbiguous && (
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300"
                    title={crsRes.ambiguityReason || crsRes.ambiguousCandidates?.join('، ')}
                  >
                    ⚠️ همنام
                  </span>
                )}
              </div>
            ) : null}

            {!profName && !crsName && (
              <span className="text-caption text-neutral-400">{t('unassigned')}</span>
            )}
          </div>
        );
      }

      case 'status':
        return renderStatusChip(item.status);

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 text-[12px] h-8 font-medium border-primary-200 text-primary-700 bg-primary-50/50 hover:bg-primary-100"
              onPress={() => onModerate(item)}
            >
              <Edit className={ICON_SIZE_CLASS.sm} />
              <span>{item.status === 'approved' ? t('view') : t('moderate')}</span>
            </Button>

            {item.status === 'pending' && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-400 hover:text-danger-600 h-8 w-8"
                aria-label={t('reject')}
                onPress={() => onReject(item)}
              >
                <X className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}

            {onDelete && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-400 hover:text-danger-600 h-8 w-8"
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

  const topContent =
    selectedIds.length > 0 ? (
      <div className="flex items-center justify-between rounded-xl bg-primary-50/80 border border-primary-200 p-3 px-4 shadow-sm transition-all animate-in fade-in">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
            {selectedIds.length.toLocaleString('fa-IR')}
          </span>
          <span className="text-body-sm font-semibold text-primary-950">
            {t('selectedCount', { count: selectedIds.length.toLocaleString('fa-IR') })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 text-neutral-600 hover:bg-white"
            onPress={() => onSelectAll?.(false)}
          >
            {t('deselectAll')}
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="text-xs h-8 gap-1.5 shadow-sm"
            onPress={onBulkDelete}
          >
            <Trash2 className={ICON_SIZE_CLASS.sm} />
            <span>{t('deleteSelected')}</span>
          </Button>
        </div>
      </div>
    ) : undefined;

  return (
    <TableContainer
      ariaLabel={t('ariaLabel')}
      headerCells={headers}
      items={items}
      isLoading={isLoading}
      topContent={topContent}
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
