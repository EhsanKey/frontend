'use client';

import { Button, ListBox, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import {
  SearchInput,
  SelectCampus,
  SelectCourse,
  SelectMajor,
  SelectProfessor,
  SelectUniversity,
} from '@/components/shared';
import type { DegreeLevel, ReviewSource } from '@/models';
import { getRecentAcademicSemesters } from '@/utils';

interface RegisteredReviewsFiltersProps {
  search: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  professorId?: string;
  courseId?: string;
  degreeLevel?: DegreeLevel | '';
  source?: ReviewSource | 'all' | '';
  semester?: string;
  onSearchChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onProfessorChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onDegreeLevelChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onClearFilters: () => void;
}

const DEGREES: DegreeLevel[] = [
  'associate',
  'bachelor',
  'master',
  'doctorate',
];

export const RegisteredReviewsFilters = ({
  search,
  universityId,
  campusId,
  majorId,
  professorId,
  courseId,
  degreeLevel,
  source,
  semester,
  onSearchChange,
  onUniversityChange,
  onCampusChange,
  onMajorChange,
  onProfessorChange,
  onCourseChange,
  onDegreeLevelChange,
  onSourceChange,
  onSemesterChange,
  onClearFilters,
}: RegisteredReviewsFiltersProps) => {
  const t = useTranslations('registeredReviews.filters');
  const tDegrees = useTranslations('registeredReviews.degrees');

  const recentSemesters = useMemo(() => getRecentAcademicSemesters(8), []);

  const hasActiveFilters = Boolean(
    search ||
      universityId ||
      campusId ||
      majorId ||
      professorId ||
      courseId ||
      degreeLevel ||
      semester ||
      (source && source !== 'all'),
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
      {/* Search Input Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchInput
            queryValue={search}
            onValueChange={onSearchChange}
            placeholder={t('search')}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onPress={onClearFilters}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-danger-600"
          >
            <RotateCcw className={ICON_SIZE_CLASS.sm} />
            {t('clearFilters')}
          </Button>
        )}
      </div>

      {/* Structured Filter Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {/* 1. University */}
        <div>
          <SelectUniversity
            value={universityId}
            onChange={(val) => {
              onUniversityChange(val);
              onCampusChange('');
            }}
            placeholder={t('allUniversities')}
            size="md"
            isClearable
          />
        </div>

        {/* 2. Campus / Unit */}
        <div>
          <SelectCampus
            universityId={universityId}
            value={campusId}
            onChange={(val) => onCampusChange(val)}
            placeholder={t('allCampuses')}
            size="md"
            isClearable
          />
        </div>

        {/* 3. Major / Field of Study */}
        <div>
          <SelectMajor
            value={majorId}
            onChange={(val) => onMajorChange(val)}
            placeholder={t('allMajors')}
            size="md"
            isClearable
          />
        </div>

        {/* 4. Professor */}
        <div>
          <SelectProfessor
            value={professorId}
            onChange={(val) => onProfessorChange(val)}
            placeholder={t('allProfessors')}
            size="md"
            isClearable
          />
        </div>

        {/* 5. Course */}
        <div>
          <SelectCourse
            value={courseId}
            onChange={(val) => onCourseChange(val)}
            placeholder={t('allCourses')}
            size="md"
            isClearable
          />
        </div>

        {/* 6. Degree Level */}
        <div>
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
              <ListBox>
                <ListBox.Item id="all" textValue={t('allDegrees')}>
                  {t('allDegrees')}
                </ListBox.Item>
                {DEGREES.map((deg) => (
                  <ListBox.Item id={deg} key={deg} textValue={tDegrees(deg)}>
                    {tDegrees(deg)}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 7. Academic Semester */}
        <div>
          <Select
            selectedKey={semester || 'all'}
            onSelectionChange={(key) =>
              onSemesterChange(String(key) === 'all' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            aria-label={t('semester')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue={t('allSemesters')}>
                  {t('allSemesters')}
                </ListBox.Item>
                {recentSemesters.map((s) => (
                  <ListBox.Item id={s.code} key={s.code} textValue={s.label}>
                    {s.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* 8. Acquisition Channel / Source */}
        <div>
          <Select
            selectedKey={source || 'all'}
            onSelectionChange={(key) =>
              onSourceChange(String(key) === 'all' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            aria-label={t('source')}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue={t('allSources')}>
                  {t('allSources')}
                </ListBox.Item>
                <ListBox.Item id="student" textValue={t('sourceStudent')}>
                  {t('sourceStudent')}
                </ListBox.Item>
                <ListBox.Item id="system" textValue={t('sourceSystem')}>
                  {t('sourceSystem')}
                </ListBox.Item>
                <ListBox.Item id="admin" textValue={t('sourceAdmin')}>
                  {t('sourceAdmin')}
                </ListBox.Item>
                <ListBox.Item id="telegram_channel" textValue={t('sourceTelegramChannel')}>
                  {t('sourceTelegramChannel')}
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
