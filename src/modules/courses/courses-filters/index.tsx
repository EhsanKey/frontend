'use client';

import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { SearchInput } from '@/components/shared';

interface CoursesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick?: () => void;
}

export const CoursesFilters = ({
  search,
  onSearchChange,
  onCreateClick,
}: CoursesFiltersProps) => {
  const t = useTranslations('courses.filters');
  const tActions = useTranslations('courses.actions');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 sm:max-w-md">
        <SearchInput
          queryValue={search}
          onValueChange={onSearchChange}
          placeholder={t('search')}
        />
      </div>

      {onCreateClick && (
        <Button
          variant="primary"
          onPress={onCreateClick}
          className="font-medium shadow-2xs"
        >
          <Plus className={ICON_SIZE_CLASS.sm} />
          {tActions('create')}
        </Button>
      )}
    </div>
  );
};
