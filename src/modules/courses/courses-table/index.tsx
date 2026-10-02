'use client';

import { Button } from '@heroui/react';
import { Edit, GitMerge, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { ICourse } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface CoursesTableProps {
  data?: PaginatedResult<ICourse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (course: ICourse) => void;
  onMerge?: (course: ICourse) => void;
  onDelete?: (course: ICourse) => void;
}

type ColumnKey = 'name' | 'actions';

export const CoursesTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onMerge,
  onDelete,
}: CoursesTableProps) => {
  const t = useTranslations('courses.table');
  const tActions = useTranslations('courses.actions');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'name', label: t('name'), className: 'min-w-[280px]', isRowHeader: true },
    { id: 'actions', label: t('actions'), className: 'w-36 text-center' },
  ];

  const renderCell = (item: ICourse, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-bold text-neutral-900">{item.name}</span>;
      case 'actions':
        if (!onEdit && !onMerge && !onDelete) {
          return <span className="text-neutral-400 text-caption">-</span>;
        }
        return (
          <div className="flex items-center justify-center gap-1">
            {onMerge && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-primary-600 hover:bg-primary-50"
                aria-label={tActions('merge')}
                onPress={() => onMerge(item)}
              >
                <GitMerge className={ICON_SIZE_CLASS.sm} />
              </Button>
            )}
            {onEdit && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-neutral-600 hover:bg-neutral-100"
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
                className="text-danger-600 hover:bg-danger-50"
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
    <TableContainer<ICourse, ColumnKey>
      ariaLabel={t('name')}
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
    />
  );
};
