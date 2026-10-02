'use client';

import { Button } from '@heroui/react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { IMajor } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface MajorsTableProps {
  data?: PaginatedResult<IMajor> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (major: IMajor) => void;
  onDelete?: (major: IMajor) => void;
}

type ColumnKey = 'name' | 'actions';

export const MajorsTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: MajorsTableProps) => {
  const t = useTranslations('majors.table');
  const tCommon = useTranslations('common');

  const hasActions = Boolean(onEdit || onDelete);

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'name', label: t('name'), className: 'min-w-[280px]', isRowHeader: true },
    ...(hasActions
      ? [{ id: 'actions' as ColumnKey, label: t('actions'), className: 'w-28 text-center' }]
      : []),
  ];

  const renderCell = (item: IMajor, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return <p className="font-bold text-neutral-900">{item.name}</p>;
      case 'actions':
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
    <TableContainer<IMajor, ColumnKey>
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
