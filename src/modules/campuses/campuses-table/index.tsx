'use client';

import { Button } from '@heroui/react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { ICampus } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface CampusesTableProps {
  data?: PaginatedResult<ICampus> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (campus: ICampus) => void;
  onDelete?: (campus: ICampus) => void;
}

type ColumnKey =
  | 'name'
  | 'university'
  | 'majorCount'
  | 'actions';

export const CampusesTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: CampusesTableProps) => {
  const t = useTranslations('campuses.table');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'name', label: t('name'), className: 'w-72', isRowHeader: true },
    { id: 'university', label: t('university'), className: 'min-w-[200px]' },
    { id: 'majorCount', label: t('majorCount'), className: 'w-48 text-center' },
    { id: 'actions', label: t('actions'), className: 'w-28 text-center' },
  ];

  const renderCell = (item: ICampus, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <p className="font-bold text-neutral-900">{item.name}</p>
        );
      case 'university':
        return (
          <span className="text-body-sm font-medium text-neutral-800">
            {item.universityName || item.university?.name || '-'}
          </span>
        );
      case 'majorCount':
        return (
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-secondary-50 px-2.5 py-0.5 text-caption font-semibold text-secondary-700">
              {t('majorsCount', { count: item.majorCount ?? 0 })}
            </span>
          </div>
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
    <TableContainer<ICampus, ColumnKey>
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
