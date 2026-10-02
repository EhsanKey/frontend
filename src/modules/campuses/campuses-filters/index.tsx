'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { SearchInput } from '@/components/shared';
import type { IUniversity } from '@/models';

interface CampusesFiltersProps {
  search: string;
  universityId?: string;
  universities: IUniversity[];
  onSearchChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onCreateClick?: () => void;
}

export const CampusesFilters = ({
  search,
  universityId,
  universities,
  onSearchChange,
  onUniversityChange,
  onCreateClick,
}: CampusesFiltersProps) => {
  const t = useTranslations('campuses.filters');
  const tActions = useTranslations('campuses.actions');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 sm:max-w-xs">
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={t('search')}
          />
        </div>

        <div className="w-full sm:w-60">
          <Select
            selectedKey={universityId || 'all'}
            onSelectionChange={(key) =>
              onUniversityChange(String(key) === 'all' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            aria-label={t('university')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('university')}>
                <ListBox.Item id="all" textValue={t('allUniversities')}>
                  {t('allUniversities')}
                </ListBox.Item>
                {universities.map((u) => (
                  <ListBox.Item key={u.id} id={u.id} textValue={u.name}>
                    {u.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
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
