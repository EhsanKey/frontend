'use client';

import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField, SelectCourse } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import type { ILookupItem } from '@/models';

export interface ModerationCourseSectionProps {
  isNew: boolean;
  onIsNewChange: (isNew: boolean) => void;
  courseId: string;
  onCourseSelect: (id: string, item?: ILookupItem) => void;
  courseName: string;
  onCourseNameChange: (name: string) => void;
  category: 'general' | 'specialized';
  onCategoryChange: (category: 'general' | 'specialized') => void;
  isDisabled?: boolean;
  errorMessage?: string;
}

export const ModerationCourseSection = ({
  isNew,
  onIsNewChange,
  courseId,
  onCourseSelect,
  courseName,
  onCourseNameChange,
  category,
  onCategoryChange,
  isDisabled,
  errorMessage,
}: ModerationCourseSectionProps) => {
  const t = useTranslations('crawler.reviews.moderationModal');

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-body-sm font-bold text-neutral-800 flex items-center gap-1.5">
          <BookOpen className={ICON_SIZE_CLASS.sm} />
          <span>{t('courseSectionTitle')}</span>
        </h4>
        <button
          type="button"
          role="switch"
          aria-checked={isNew}
          disabled={isDisabled}
          onClick={() => onIsNewChange(!isNew)}
          className="flex items-center gap-2 cursor-pointer text-caption text-neutral-600 select-none hover:text-neutral-900 transition-colors"
        >
          <span>{t('isCourseNew')}</span>
          <div
            dir="ltr"
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
              isNew ? 'bg-primary-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                isNew ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </div>

      {isNew ? (
        <InputField
          label={t('newCourseName')}
          value={courseName}
          onChange={(e) => onCourseNameChange(e.target.value)}
          placeholder={t('newCoursePlaceholder')}
          errorMessage={errorMessage}
          isInvalid={Boolean(errorMessage)}
          isDisabled={isDisabled}
        />
      ) : (
        <SelectCourse
          label={t('existingCourse')}
          value={courseId}
          initialLabel={courseName}
          onChange={onCourseSelect}
          isDisabled={isDisabled}
        />
      )}

      {/* Course Category */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-neutral-200/60">
        <span className="text-[12px] font-medium text-neutral-600">
          {t('courseCategory')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => onCategoryChange('specialized')}
            className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-all cursor-pointer ${
              category === 'specialized'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {t('specialized')}
          </button>
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => onCategoryChange('general')}
            className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-all cursor-pointer ${
              category === 'general'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {t('general')}
          </button>
        </div>
      </div>
    </div>
  );
};
