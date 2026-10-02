'use client';

import { ListBox, Select } from '@heroui/react';
import { Calendar, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import type { DegreeLevel } from '@/models';

const DEGREES: DegreeLevel[] = [
  'associate',
  'bachelor',
  'master',
  'doctorate',
];

export interface ModerationDegreeSemesterSectionProps {
  degreeLevel: DegreeLevel;
  onDegreeLevelChange: (degree: DegreeLevel) => void;
  semester: string;
  onSemesterChange: (semester: string) => void;
  recentSemesters: Array<{ code: string; label: string }>;
  isDisabled?: boolean;
}

export const ModerationDegreeSemesterSection = ({
  degreeLevel,
  onDegreeLevelChange,
  semester,
  onSemesterChange,
  recentSemesters,
  isDisabled,
}: ModerationDegreeSemesterSectionProps) => {
  const t = useTranslations('crawler.reviews.moderationModal');
  const tDegrees = useTranslations('registeredReviews.degrees');

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
      <h4 className="text-body-sm font-bold text-neutral-800 flex items-center gap-1.5">
        <GraduationCap className={ICON_SIZE_CLASS.sm} />
        <span>{t('degreeAndSemesterTitle')}</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Degree */}
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-neutral-700">
            {t('degreeLevel')}
          </label>
          <Select
            selectedKey={degreeLevel}
            onSelectionChange={(key) =>
              onDegreeLevelChange(String(key) as DegreeLevel)
            }
            variant="secondary"
            className="w-full"
            isDisabled={isDisabled}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {DEGREES.map((deg) => (
                  <ListBox.Item
                    id={deg}
                    key={deg}
                    textValue={tDegrees(deg)}
                  >
                    {tDegrees(deg)}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Semester */}
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-neutral-700">
            {t('semester')}
          </label>
          <Select
            selectedKey={semester || 'none'}
            onSelectionChange={(key) =>
              onSemesterChange(String(key) === 'none' ? '' : String(key))
            }
            variant="secondary"
            className="w-full"
            isDisabled={isDisabled}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="none" textValue={t('allSemesters')}>
                  {t('allSemesters')}
                </ListBox.Item>
                {recentSemesters.map((s) => (
                  <ListBox.Item
                    id={s.code}
                    key={s.code}
                    textValue={s.label}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{s.label}</span>
                    </div>
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
