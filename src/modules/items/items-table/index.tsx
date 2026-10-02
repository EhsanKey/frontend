'use client';

import { Button, Chip } from '@heroui/react';
import { Edit2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatPersianDate } from '@/utils';
import type { ItemsTableProps } from './types';
import type { IItem } from '@/models';

type ColumnKey = 'id' | 'title' | 'category' | 'status' | 'createdAt' | 'actions';

export const ItemsTable = ({
  items,
  pagination,
  isLoading,
  onEdit,
  onDelete,
}: ItemsTableProps) => {
  const t = useTranslations('items');
  const tCategories = useTranslations('items.categories');
  const tCommon = useTranslations('common');

  const headerCells: TableHeaderOptions<ColumnKey>[] = [
    {
      id: 'id',
      label: t('columns.id'),
      className: 'w-16 text-center',
      cellClassName: 'text-center font-mono text-neutral-500',
    },
    {
      id: 'title',
      label: t('columns.title'),
      className: 'min-w-48',
      isRowHeader: true,
    },
    {
      id: 'category',
      label: t('columns.category'),
      className: 'w-32',
    },
    {
      id: 'status',
      label: t('columns.status'),
      className: 'w-28 text-center',
      cellClassName: 'text-center',
    },
    {
      id: 'createdAt',
      label: t('columns.createdAt'),
      className: 'w-32 text-center',
      cellClassName: 'text-center font-mono text-neutral-500',
    },
    {
      id: 'actions',
      label: t('columns.actions'),
      className: 'w-24 text-center',
      cellClassName: 'text-center',
    },
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technical':
        return tCategories('technical');
      case 'financial':
        return tCategories('financial');
      case 'administrative':
        return tCategories('administrative');
      default:
        return tCategories('general');
    }
  };

  const renderStatusChip = (status: IItem['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Chip size="sm" variant="soft" className="bg-success-50 text-success-700">
            {tCommon('statuses.active')}
          </Chip>
        );
      case 'PENDING':
        return (
          <Chip size="sm" variant="soft" className="bg-warning-50 text-warning-700">
            {tCommon('statuses.pending')}
          </Chip>
        );
      case 'INACTIVE':
        return (
          <Chip size="sm" variant="soft" className="bg-neutral-100 text-neutral-600">
            {tCommon('statuses.inactive')}
          </Chip>
        );
      default:
        return null;
    }
  };

  const renderCell = (item: IItem, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'id':
        return `#${item.id}`;
      case 'title':
        return (
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900">{item.title}</span>
            {item.description && (
              <span className="line-clamp-1 text-caption text-neutral-400">
                {item.description}
              </span>
            )}
          </div>
        );
      case 'category':
        return (
          <span className="text-body-sm text-neutral-600">
            {getCategoryLabel(item.category)}
          </span>
        );
      case 'status':
        return renderStatusChip(item.status);
      case 'createdAt':
        return (
          <span className="text-caption text-neutral-600">
            {formatPersianDate(item.createdAt)}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={() => onEdit(item)}
              aria-label={tCommon('actions.edit')}
              className="text-neutral-500 hover:text-primary-600"
            >
              <Edit2 className={ICON_SIZE_CLASS.sm} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={() => onDelete(item)}
              aria-label={tCommon('actions.delete')}
              className="text-neutral-500 hover:text-danger-600"
            >
              <Trash2 className={ICON_SIZE_CLASS.sm} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer
      ariaLabel={t('title')}
      headerCells={headerCells}
      items={items}
      pagination={pagination}
      isLoading={isLoading}
      renderCell={renderCell}
      emptyComponent={
        <div className="flex min-h-40 flex-col items-center justify-center p-8 text-neutral-400">
          <p className="text-body-sm">{tCommon('table.empty')}</p>
        </div>
      }
    />
  );
};

export default ItemsTable;
