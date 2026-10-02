'use client';

import { Button } from '@heroui/react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import type { DegreeLevel, ITeaching } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface TeachingsTableProps {
  data?: PaginatedResult<ITeaching> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (teaching: ITeaching) => void;
  onDelete?: (teaching: ITeaching) => void;
}

type ColumnKey =
  | 'professor'
  | 'course'
  | 'university'
  | 'major'
  | 'degreeLevel'
  | 'semester'
  | 'actions';

const DEGREE_COLOR_MAP: Record<DegreeLevel, string> = {
  associate: 'bg-neutral-100 text-neutral-700',
  bachelor: 'bg-primary-50 text-primary-700',
  master: 'bg-secondary-50 text-secondary-700',
  doctorate: 'bg-accent-50 text-accent-700',
  unknown: 'bg-neutral-100 text-neutral-700',
};

export const TeachingsTable = ({
  data,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: TeachingsTableProps) => {
  const t = useTranslations('teachings.table');
  const tDegrees = useTranslations('teachings.degrees');
  const tCommon = useTranslations('common');

  const headers: TableHeaderOptions<ColumnKey>[] = [
    {
      id: 'professor',
      label: t('professor'),
      className: 'w-48',
      isRowHeader: true,
    },
    { id: 'course', label: t('course'), className: 'w-48' },
    { id: 'university', label: t('university'), className: 'w-56' },
    { id: 'major', label: t('major'), className: 'w-44' },
    {
      id: 'degreeLevel',
      label: t('degreeLevel'),
      className: 'w-32 text-center',
    },
    { id: 'semester', label: t('semester'), className: 'w-40' },
    { id: 'actions', label: t('actions'), className: 'w-28 text-center' },
  ];

  const renderCell = (item: ITeaching, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'professor':
        return (
          <p className="font-bold text-neutral-900">
            {item.professor?.name || '-'}
          </p>
        );
      case 'course':
        return (
          <p className="font-medium text-neutral-800">
            {item.course?.name || '-'}
          </p>
        );
      case 'university':
        return (
          <div className="text-body-sm">
            <p className="font-medium text-neutral-800">
              {item.campus?.name || '-'}
            </p>
            {item.campus?.university?.name ? (
              <p className="text-caption text-neutral-500">
                {item.campus.university.name}
              </p>
            ) : null}
          </div>
        );
      case 'major':
        return (
          <span className="text-body-sm text-neutral-700">
            {item.major?.name || '-'}
          </span>
        );
      case 'degreeLevel': {
        const lvl = item.degreeLevel;
        const validDegrees = [
          'associate',
          'bachelor',
          'master',
          'doctorate',
          'unknown',
        ];
        const isKnown = lvl && validDegrees.includes(lvl);
        return (
          <div className="text-center">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-caption font-semibold ${
                (lvl && DEGREE_COLOR_MAP[lvl as DegreeLevel]) ||
                'bg-neutral-100 text-neutral-700'
              }`}
            >
              {isKnown
                ? tDegrees(lvl as Parameters<typeof tDegrees>[0])
                : lvl || tDegrees('unknown')}
            </span>
          </div>
        );
      }
      case 'semester':
        return (
          <span className="text-caption text-neutral-500">
            {item.semester || '-'}
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
    <TableContainer<ITeaching, ColumnKey>
      ariaLabel={t('professor')}
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
