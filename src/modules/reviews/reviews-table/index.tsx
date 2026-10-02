'use client';

import { Button, Chip } from '@heroui/react';
import { Check, Edit, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate, formatSemesterCode } from '@/utils';
import type { IReviewSubmission, ReviewStatus } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface ReviewsTableProps {
  data?: PaginatedResult<IReviewSubmission> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onApprove?: (review: IReviewSubmission) => void;
  onReject?: (review: IReviewSubmission) => void;
  onEdit?: (review: IReviewSubmission) => void;
  onDelete?: (review: IReviewSubmission) => void;
}

type ColumnKey =
  | 'academic'
  | 'professor'
  | 'course'
  | 'semester'
  | 'content'
  | 'status'
  | 'createdAt'
  | 'actions';

export const ReviewsTable = ({
  data,
  isLoading,
  onPageChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: ReviewsTableProps) => {
  const t = useTranslations('reviews.table');
  const tReviews = useTranslations('reviews');
  const tStatus = useTranslations('reviews.filters');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'academic', label: t('academic'), className: 'w-48', isRowHeader: true },
    { id: 'professor', label: t('professor'), className: 'w-44' },
    { id: 'course', label: t('course'), className: 'w-44' },
    { id: 'semester', label: t('semester'), className: 'w-40' },
    { id: 'content', label: t('content') },
    { id: 'status', label: t('status'), className: 'w-28' },
    { id: 'createdAt', label: t('createdAt'), className: 'w-28', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-36 text-center' },
  ];

  const renderStatusChip = (status: ReviewStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
            {tStatus('approved')}
          </Chip>
        );
      case 'rejected':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {tStatus('rejected')}
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
    item: IReviewSubmission,
    columnKey: ColumnKey,
  ) => {
    switch (columnKey) {
      case 'academic':
        return (
          <div className="flex flex-col gap-0.5 max-w-[200px]">
            <span className="font-semibold text-neutral-900 text-body-sm truncate">
              {item.universityName || tCommon('academic.unknownUniversity')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate">
              {item.campusName && <span>{item.campusName}</span>}
              {item.campusName && item.majorName && <span>•</span>}
              {item.majorName && <span>{item.majorName}</span>}
              {!item.campusName && !item.majorName && <span>-</span>}
            </div>
          </div>
        );
      case 'professor':
        return (
          <div className="flex flex-col gap-1 items-start max-w-[180px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-neutral-900 text-body-sm">
                {item.professorName}
              </span>
              {item.professorIsNew && (
                <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0 h-4">
                  {t('newProfessor')}
                </Chip>
              )}
            </div>
            {item.studentName && (
              <span className="text-[11px] text-neutral-400">
                {t('studentPrefix', { name: item.studentName })}
              </span>
            )}
          </div>
        );
      case 'course':
        return (
          <div className="flex flex-col gap-1 items-start max-w-[180px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-neutral-800 text-body-sm font-medium">
                {item.courseName}
              </span>
              {item.courseIsNew && (
                <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0 h-4">
                  {t('newCourse')}
                </Chip>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
              {item.courseCategory && (
                <span className="font-medium text-neutral-600">
                  {item.courseCategory === 'specialized' ? tCommon('academic.specialized') : tCommon('academic.general')}
                </span>
              )}
              {item.courseCategory && item.degreeLevels && <span>•</span>}
              {item.degreeLevels && <span>{item.degreeLevels}</span>}
              {!item.courseCategory && !item.degreeLevels && <span>-</span>}
            </div>
          </div>
        );
      case 'semester':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm font-medium text-neutral-800">
              {formatSemesterCode(item.semester)}
            </span>
            {item.semester && (
              <span className="text-caption text-neutral-400 font-mono" dir="ltr">
                [{item.semester}]
              </span>
            )}
          </div>
        );
      case 'content':
        return (
          <div className="max-w-md">
            <p className="line-clamp-2 text-body-sm text-neutral-800 leading-relaxed">
              {item.content}
            </p>
            {item.rejectionReason ? (
              <p className="mt-1 text-caption text-danger-600">
                {t('rejectionReason', { reason: item.rejectionReason })}
              </p>
            ) : null}
          </div>
        );
      case 'status':
        return renderStatusChip(item.status);
      case 'createdAt':
        return (
          <span className="text-caption text-neutral-500">
            {formatPersianDate(item.createdAt)}
          </span>
        );
      case 'actions':
        if (!onApprove && !onReject && !onEdit && !onDelete) {
          return <span className="text-neutral-400 text-caption">-</span>;
        }
        return (
          <div className="flex items-center justify-center gap-1">
            {item.status === 'pending' ? (
              <>
                {onApprove && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="text-success-600 hover:bg-success-50"
                    aria-label={tReviews('actions.approve')}
                    onPress={() => onApprove(item)}
                  >
                    <Check className={ICON_SIZE_CLASS.sm} />
                  </Button>
                )}
                {onReject && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="text-danger-600 hover:bg-danger-50"
                    aria-label={tReviews('actions.reject')}
                    onPress={() => onReject(item)}
                  >
                    <X className={ICON_SIZE_CLASS.sm} />
                  </Button>
                )}
              </>
            ) : null}
            {onEdit && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-500 hover:text-neutral-900"
                aria-label={tCommon('actions.edit')}
                onPress={() => onEdit(item)}
              >
                <Edit className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}
            {onDelete && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-400 hover:text-danger-600"
                aria-label={tCommon('actions.delete')}
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
