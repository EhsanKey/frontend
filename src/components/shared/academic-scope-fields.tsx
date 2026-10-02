'use client';

import { cn } from '@/utils';
import { SelectUniversity } from './select-university';
import { SelectCampus } from './select-campus';
import { SelectMajor } from './select-major';

export interface AcademicScopeFieldsProps {
  universityId: string;
  universityName?: string;
  campusId: string;
  campusName?: string;
  majorId?: string;
  majorName?: string;
  onUniversityChange: (universityId: string) => void;
  onCampusChange: (campusId: string) => void;
  onMajorChange?: (majorId: string) => void;
  includeMajor?: boolean;
  isDisabled?: boolean;
  layout?: 'grid' | 'stack';
  title?: string;
  className?: string;
}

export const AcademicScopeFields = ({
  universityId,
  universityName,
  campusId,
  campusName,
  majorId = '',
  majorName,
  onUniversityChange,
  onCampusChange,
  onMajorChange,
  includeMajor = true,
  isDisabled = false,
  layout = 'grid',
  title,
  className,
}: AcademicScopeFieldsProps) => {
  const handleUniversitySelect = (newUniversityId: string) => {
    onUniversityChange(newUniversityId);
    onCampusChange('');
    if (onMajorChange) {
      onMajorChange('');
    }
  };

  const handleCampusSelect = (newCampusId: string) => {
    onCampusChange(newCampusId);
    if (onMajorChange) {
      onMajorChange('');
    }
  };

  const content = (
    <>
      <div
        className={cn(
          layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            : 'flex flex-col gap-3',
        )}
      >
        <SelectUniversity
          value={universityId}
          initialLabel={universityName}
          onChange={handleUniversitySelect}
          isDisabled={isDisabled}
        />

        <SelectCampus
          universityId={universityId}
          value={campusId}
          initialLabel={campusName}
          onChange={handleCampusSelect}
          isDisabled={isDisabled}
        />
      </div>

      {includeMajor && onMajorChange && (
        <SelectMajor
          value={majorId}
          initialLabel={majorName}
          onChange={onMajorChange}
          isDisabled={isDisabled}
        />
      )}
    </>
  );

  if (title) {
    return (
      <div
        className={cn(
          'rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 flex flex-col gap-3',
          className,
        )}
      >
        <span className="text-caption font-bold text-neutral-700">
          {title}
        </span>
        {content}
      </div>
    );
  }

  return <div className={cn('flex flex-col gap-3', className)}>{content}</div>;
};
