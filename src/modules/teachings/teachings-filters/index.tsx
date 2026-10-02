'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { SearchInput, SelectCourse, SelectProfessor } from '@/components/shared';
import type { DegreeLevel, ICourse, IProfessor } from '@/models';

interface TeachingsFiltersProps {
  search: string;
  professorId?: string;
  courseId?: string;
  degreeLevel?: string;
  professors?: IProfessor[];
  courses?: ICourse[];
  onSearchChange: (value: string) => void;
  onProfessorChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onDegreeLevelChange: (value: string) => void;
  onCreateClick?: () => void;
}

const DEGREES: DegreeLevel[] = ['associate', 'bachelor', 'master', 'doctorate'];

export const TeachingsFilters = ({
  search,
  professorId,
  courseId,
  degreeLevel,
  onSearchChange,
  onProfessorChange,
  onCourseChange,
  onDegreeLevelChange,
  onCreateClick,
}: TeachingsFiltersProps) => {
  const t = useTranslations('teachings.filters');
  const tDegrees = useTranslations('teachings.degrees');
  const tActions = useTranslations('teachings.actions');

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="flex flex-wrap items-center gap-3">
        {/* Professor Select */}
        <div className="w-full sm:w-60">
          <SelectProfessor
            value={professorId}
            onChange={(val) => onProfessorChange(val)}
            placeholder={t('allProfessors')}
            size="md"
            isClearable
          />
        </div>

        {/* Course Select */}
        <div className="w-full sm:w-60">
          <SelectCourse
            value={courseId}
            onChange={(val) => onCourseChange(val)}
            placeholder={t('allCourses')}
            size="md"
            isClearable
          />
        </div>


        {/* DegreeLevel Select */}
        <div className="w-full sm:w-44">
          <Select
            selectedKey={degreeLevel || 'all'}
            onSelectionChange={(key) =>
              onDegreeLevelChange(String(key) === 'all' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            aria-label={t('degreeLevel')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label={t('degreeLevel')}>
                <ListBox.Item id="all" textValue={t('allDegrees')}>
                  {t('allDegrees')}
                </ListBox.Item>
                {DEGREES.map((deg) => (
                  <ListBox.Item key={deg} id={deg} textValue={tDegrees(deg as Parameters<typeof tDegrees>[0])}>
                    {tDegrees(deg as Parameters<typeof tDegrees>[0])}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
