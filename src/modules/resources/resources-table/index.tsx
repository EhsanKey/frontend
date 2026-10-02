'use client';

import { Button, Chip } from '@heroui/react';
import { Edit, FileText, Send, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { IResourceSubmission, ResourceKind, ResourceStatus } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface ResourcesTableProps {
  data?: PaginatedResult<IResourceSubmission> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onApprove?: (resource: IResourceSubmission) => void;
  onReject?: (resource: IResourceSubmission) => void;
  onEdit?: (resource: IResourceSubmission) => void;
  onDelete?: (resource: IResourceSubmission) => void;
}

type ColumnKey =
  | 'title'
  | 'kind'
  | 'academic'
  | 'professorCourse'
  | 'files'
  | 'status'
  | 'createdAt'
  | 'actions';

export const ResourcesTable = ({
  data,
  isLoading,
  onPageChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: ResourcesTableProps) => {
  const t = useTranslations('resources.table');
  const tResources = useTranslations('resources');
  const tKind = useTranslations('resources.filters');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'title', label: t('title'), className: 'w-56', isRowHeader: true },
    { id: 'kind', label: t('kind'), className: 'w-28' },
    { id: 'academic', label: t('academic'), className: 'w-44' },
    { id: 'professorCourse', label: t('professorCourse'), className: 'w-48' },
    { id: 'files', label: t('files'), className: 'w-44' },
    { id: 'status', label: t('status'), className: 'w-28' },
    { id: 'createdAt', label: t('createdAt'), className: 'w-28', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-36 text-center' },
  ];

  const renderKindChip = (kind: ResourceKind) => {
    if (kind === 'exam_sample') {
      return (
        <Chip size="sm" variant="secondary" className="bg-violet-50 text-violet-700 font-medium">
          {tKind('exam_sample')}
        </Chip>
      );
    }
    return (
      <Chip size="sm" variant="secondary" className="bg-info-50 text-info-700 font-medium">
        {tKind('lecture_note')}
      </Chip>
    );
  };

  const renderStatusChip = (status: ResourceStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
            {t('publishedInChannel')}
          </Chip>
        );
      case 'rejected':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {tKind('rejected')}
          </Chip>
        );
      case 'pending':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 font-medium">
            {tKind('pending')}
          </Chip>
        );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderCell = (
    item: IResourceSubmission,
    columnKey: ColumnKey,
  ) => {
    switch (columnKey) {
      case 'title':
        return (
          <div>
            <p className="font-semibold text-neutral-900 line-clamp-1">{item.title}</p>
            {item.rejectionReason ? (
              <p className="mt-1 text-caption text-danger-600 line-clamp-1">
                {t('rejectionReason', { reason: item.rejectionReason })}
              </p>
            ) : null}
          </div>
        );
      case 'kind':
        return renderKindChip(item.resourceKind);
      case 'academic':
        return (
          <div className="flex flex-col gap-0.5 max-w-[180px]">
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
      case 'professorCourse':
        return (
          <div className="flex flex-col gap-1 items-start max-w-[200px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-neutral-900 text-body-sm">
                {item.professorName || '-'}
              </span>
              {item.professorIsNew && (
                <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0 h-4">
                  {t('newProfessor')}
                </Chip>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-neutral-700 text-caption font-medium">
                {item.courseName || '-'}
              </span>
              {item.courseIsNew && (
                <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0 h-4">
                  {t('newCourse')}
                </Chip>
              )}
            </div>
            {(item.courseCategory || item.degreeLevel) && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                {item.courseCategory && (
                  <span>{item.courseCategory === 'specialized' ? tCommon('academic.specialized') : tCommon('academic.general')}</span>
                )}
                {item.courseCategory && item.degreeLevel && <span>•</span>}
                {item.degreeLevel && <span>{item.degreeLevel}</span>}
              </div>
            )}
            {item.studentName && (
              <span className="text-[11px] text-neutral-400">
                {t('studentPrefix', { name: item.studentName })}
              </span>
            )}
          </div>
        );
      case 'files':
        return (
          <div className="flex flex-col gap-1">
            {item.files.map((file) => (
              <div
                key={file.fileId}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-0.5 text-caption font-medium text-neutral-700"
              >
                <FileText className="size-3 text-neutral-500" />
                <span className="truncate max-w-[120px]">{file.fileName}</span>
                <span className="text-neutral-400">({formatFileSize(file.fileSize)})</span>
              </div>
            ))}
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
                    aria-label={tResources('actions.approve')}
                    onPress={() => onApprove(item)}
                  >
                    <Send className={ICON_SIZE_CLASS.sm} />
                  </Button>
                )}
                {onReject && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="text-danger-600 hover:bg-danger-50"
                    aria-label={tResources('actions.reject')}
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
