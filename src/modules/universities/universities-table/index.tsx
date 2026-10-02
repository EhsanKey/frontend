'use client';

import { Button } from '@heroui/react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { formatPersianDate } from '@/utils';
import type { IUniversity } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface UniversitiesTableProps {
  data?: PaginatedResult<IUniversity> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (university: IUniversity) => void;
  onDelete?: (university: IUniversity) => void;
}

type ColumnKey =
  | 'name'
  | 'campusCount'
  | 'createdAt'
  | 'actions';

export const UniversitiesTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: UniversitiesTableProps) => {
  const t = useTranslations('universities.table');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'name', label: t('name'), className: 'min-w-[240px]', isRowHeader: true },
    { id: 'campusCount', label: t('campusCount'), className: 'w-48 text-center' },
    { id: 'createdAt', label: t('createdAt'), className: 'w-40', cellDir: 'ltr' },
    { id: 'actions', label: t('actions'), className: 'w-28 text-center' },
  ];

  const renderCell = (item: IUniversity, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return <p className="font-bold text-neutral-900">{item.name}</p>;
      case 'campusCount':
        return (
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-caption font-semibold text-primary-700">
              {t('campusUnit', { count: item.campusCount ?? 0 })}
            </span>
          </div>
        );
      case 'createdAt':
        return (
          <span className="text-caption text-neutral-500">
            {formatPersianDate(item.createdAt)}
          </span>
        );
      case 'actions':
        if (!onEdit && !onDelete) {
          return <span className="text-neutral-400 text-caption">-</span>;
        }
        return (
          <div className="flex items-center justify-center gap-1">
            {onEdit && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onEdit(item)}
                aria-label={tCommon('actions.edit')}
                className="text-neutral-600 hover:text-primary-600"
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
                aria-label={tCommon('actions.delete')}
                className="text-neutral-600 hover:text-danger-600"
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
    <TableContainer<IUniversity, ColumnKey>
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
