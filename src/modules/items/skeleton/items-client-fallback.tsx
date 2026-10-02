import { Skeleton } from '@heroui/react';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { PAGE_SIZE } from '@/constants';

const headerCells: TableHeaderOptions[] = [
  { id: 'id', label: '...', className: 'w-16' },
  { id: 'title', label: '...', isRowHeader: true },
  { id: 'category', label: '...', className: 'w-32' },
  { id: 'status', label: '...', className: 'w-28' },
  { id: 'createdAt', label: '...', className: 'w-32' },
  { id: 'actions', label: '...', className: 'w-24' },
];

export const ItemsClientFallback = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Top filters skeleton */}
      <div className="bg-surface flex flex-col gap-4 rounded-xl border border-neutral-200/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Table skeleton */}
      <TableContainer
        ariaLabel="Loading items"
        headerCells={headerCells}
        items={[]}
        isLoading={true}
        loadingRowCount={PAGE_SIZE}
        renderCell={() => null}
      />
    </div>
  );
};

export default ItemsClientFallback;
