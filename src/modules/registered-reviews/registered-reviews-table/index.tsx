'use client';

import { Button, Chip, Modal } from '@heroui/react';
import { Bot, Edit, Eye, MessageSquare, Radio, Trash2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { DegreeLevel, IRegisteredReview, ReviewSource } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import { formatSemesterCode } from '@/utils';

interface RegisteredReviewsTableProps {
  data?: PaginatedResult<IRegisteredReview> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (review: IRegisteredReview) => void;
  onDelete?: (review: IRegisteredReview) => void;
}

type ColumnKey =
  | 'content'
  | 'professor'
  | 'course'
  | 'academic'
  | 'majorDegree'
  | 'semester'
  | 'source'
  | 'createdAt'
  | 'actions';

const DEGREE_COLOR_MAP: Record<DegreeLevel, string> = {
  associate: 'bg-neutral-100 text-neutral-700',
  bachelor: 'bg-primary-50 text-primary-700',
  master: 'bg-secondary-50 text-secondary-700',
  doctorate: 'bg-accent-50 text-accent-700',
  unknown: 'bg-neutral-100 text-neutral-700',
};

export const RegisteredReviewsTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: RegisteredReviewsTableProps) => {
  const t = useTranslations('registeredReviews.table');
  const tDegrees = useTranslations('registeredReviews.degrees');
  const tCommon = useTranslations('common');

  const [expandedReview, setExpandedReview] = useState<IRegisteredReview | null>(null);

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'content', label: t('content'), className: 'min-w-[280px]', isRowHeader: true },
    { id: 'professor', label: t('professor'), className: 'w-44' },
    { id: 'course', label: t('course'), className: 'w-44' },
    { id: 'academic', label: t('university'), className: 'w-48' },
    { id: 'majorDegree', label: t('major'), className: 'w-48' },
    { id: 'semester', label: t('semester'), className: 'w-44 text-center' },
    { id: 'source', label: t('source'), className: 'w-40' },
    { id: 'createdAt', label: t('createdAt'), className: 'w-28 text-center', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-24 text-center' },
  ];

  const renderSourceChip = (item: IRegisteredReview) => {
    const src: ReviewSource = item.source || 'system';

    if (src === 'student') {
      const studentName = item.student?.firstName
        ? [item.student.firstName, item.student.lastName].filter(Boolean).join(' ')
        : item.student?.username
          ? `@${item.student.username}`
          : null;

      return (
        <div className="flex flex-col gap-1 items-start">
          <Chip
            size="sm"
            variant="secondary"
            className="bg-primary-50 text-primary-700 font-medium flex items-center gap-1"
          >
            <User className="w-3 h-3 inline-block me-1" />
            {t('sourceBadgeStudent')}
          </Chip>
          {studentName && (
            <span className="text-[11px] text-neutral-500 truncate max-w-[130px]" title={studentName}>
              {studentName}
            </span>
          )}
        </div>
      );
    }

    if (src === 'telegram_channel') {
      return (
        <Chip
          size="sm"
          variant="secondary"
          className="bg-sky-50 text-sky-700 font-medium flex items-center gap-1"
        >
          <Radio className="w-3 h-3 inline-block me-1" />
          {t('sourceBadgeTelegramChannel')}
        </Chip>
      );
    }

    if (src === 'admin') {
      return (
        <Chip
          size="sm"
          variant="secondary"
          className="bg-amber-50 text-amber-700 font-medium flex items-center gap-1"
        >
          {t('sourceBadgeAdmin')}
        </Chip>
      );
    }

    return (
      <Chip
        size="sm"
        variant="secondary"
        className="bg-neutral-100 text-neutral-600 font-medium flex items-center gap-1"
      >
        <Bot className="w-3 h-3 inline-block me-1" />
        {t('sourceBadgeSystem')}
      </Chip>
    );
  };

  const renderCell = (item: IRegisteredReview, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'content': {
        const isLong = item.content.length > 90;
        return (
          <div className="flex flex-col gap-1 max-w-[340px]">
            <p className="text-body-sm text-neutral-800 leading-relaxed line-clamp-2">
              {item.content}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpandedReview(item)}
                className="text-[12px] text-primary-600 hover:text-primary-700 font-medium self-start flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                {t('viewMore')}
              </button>
            )}
          </div>
        );
      }
      case 'professor':
        return (
          <p className="font-semibold text-neutral-900 text-body-sm">
            {item.teaching?.professor?.name || '-'}
          </p>
        );
      case 'course':
        return (
          <p className="font-medium text-neutral-800 text-body-sm">
            {item.teaching?.course?.name || '-'}
          </p>
        );
      case 'academic':
        return (
          <div className="text-body-sm flex flex-col gap-0.5 max-w-[190px]">
            <p className="font-medium text-neutral-800 truncate">
              {item.teaching?.campus?.name || '-'}
            </p>
            {item.teaching?.campus?.university?.name ? (
              <p className="text-caption text-neutral-500 truncate">
                {item.teaching.campus.university.name}
              </p>
            ) : null}
          </div>
        );
      case 'majorDegree': {
        const lvl = (item.teaching?.degreeLevel || 'unknown') as DegreeLevel;
        const colorClass = DEGREE_COLOR_MAP[lvl] || DEGREE_COLOR_MAP.unknown;
        return (
          <div className="flex flex-col gap-1 items-start max-w-[180px]">
            <span className="text-body-sm text-neutral-800 truncate">
              {item.teaching?.major?.name || '-'}
            </span>
            <Chip size="sm" variant="secondary" className={`${colorClass} font-medium text-[11px]`}>
              {tDegrees(lvl)}
            </Chip>
          </div>
        );
      }
      case 'semester': {
        const semesterText = formatSemesterCode(item.semester);
        return (
          <div className="flex flex-col items-center justify-center">
            <span className="text-body-sm font-medium text-neutral-800 text-center">
              {semesterText}
            </span>
            {item.semester && (
              <span className="text-caption text-neutral-400 font-mono text-[11px]">
                {item.semester}
              </span>
            )}
          </div>
        );
      }
      case 'source':
        return renderSourceChip(item);
      case 'createdAt': {
        if (!item.createdAt) return <span className="text-neutral-400">-</span>;
        const formattedDate = new Date(item.createdAt).toLocaleDateString('fa-IR');
        return <span className="text-body-sm text-neutral-600">{formattedDate}</span>;
      }
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            {onEdit && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onEdit(item)}
                className="text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label={tCommon('actions.edit')}
              >
                <Edit className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}
            {onDelete && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onDelete(item)}
                className="text-danger-600 hover:bg-danger-50"
                aria-label={tCommon('actions.delete')}
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
    <>
      <TableContainer
        ariaLabel={t('ariaLabel')}
        headerCells={headers}
        items={data?.items ?? []}
        isLoading={isLoading}
        renderCell={(item, columnKey) => renderCell(item, columnKey)}
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

      {/* Expanded Review Content Modal */}
      {expandedReview && (
        <Modal
          isOpen={Boolean(expandedReview)}
          onOpenChange={(open) => !open && setExpandedReview(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="md">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading className="flex items-center gap-2 text-neutral-800">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    {t('content')}
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-200">
                    <p className="text-body-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {expandedReview.content}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-caption text-neutral-500">
                    <span>استاد: {expandedReview.teaching?.professor?.name}</span>
                    <span>•</span>
                    <span>درس: {expandedReview.teaching?.course?.name}</span>
                  </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-end">
                  <Button variant="outline" onPress={() => setExpandedReview(null)}>
                    {t('close')}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
};
