'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import { SearchInput } from './search-input';

export interface EntityToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onCreateClick?: () => void;
  createLabel?: string;
  searchClassName?: string;
  /** Extra filter controls rendered under the search / create row. */
  children?: ReactNode;
  className?: string;
}

/**
 * Standard list-page toolbar: debounced search + optional "create" action + extra filters.
 *
 * Replaces the per-module `*-filters/index.tsx` files that only differed by translation
 * namespace. Modules needing custom layout keep their own component.
 */
export const EntityToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder,
  onCreateClick,
  createLabel,
  searchClassName = 'sm:max-w-md',
  children,
  className,
}: EntityToolbarProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className={cn('flex-1', searchClassName)}>
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {onCreateClick ? (
          <Button
            variant="primary"
            onPress={onCreateClick}
            className="font-medium shadow-2xs"
          >
            <Plus className={ICON_SIZE_CLASS.sm} />
            {createLabel}
          </Button>
        ) : null}
      </div>

      {children}
    </div>
  );
};

export default EntityToolbar;
