'use client';

import { Button } from '@heroui/react';
import { Edit, GitMerge, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { IProfessor } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface ProfessorsTableProps {
  data?: PaginatedResult<IProfessor> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (professor: IProfessor) => void;
  onMerge?: (professor: IProfessor) => void;
  onDelete?: (professor: IProfessor) => void;
}

type ColumnKey = 'name' | 'actions';

export const ProfessorsTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onMerge,
  onDelete,
}: ProfessorsTableProps) => {
  const t = useTranslations('professors.table');
  const tActions = useTranslations('professors.actions');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    { id: 'name', label: t('name'), className: 'min-w-[280px]', isRowHeader: true },
    { id: 'actions', label: t('actions'), className: 'w-36 text-center' },
  ];

  const renderCell = (item: IProfessor, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return <p className="font-bold text-neutral-900">{item.name}</p>;
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
    <TableContainer<IProfessor, ColumnKey>
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
