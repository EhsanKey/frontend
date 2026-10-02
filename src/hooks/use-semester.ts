'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import {
  getRecentAcademicSemesters,
  parseSemesterCode,
  type AcademicSemesterInfo,
  type AcademicTerm,
} from '@/utils';

export interface SemesterOption {
  code: string;
  label: string;
  term: AcademicTerm;
  academicYear: number;
}

const TERM_MESSAGE_KEY: Record<AcademicTerm, 'term1' | 'term2' | 'summer'> = {
  1: 'term1',
  2: 'term2',
  3: 'summer',
};

type SemesterLabelFormatter = (info: AcademicSemesterInfo) => string;

/**
 * Localized academic-semester helpers.
 *
 * Replaces the hardcoded Persian labels that used to live inside
 * `src/utils/academic-semester.ts` and the ad-hoc "unshift the current semester"
 * snippets repeated in four different review/resource forms.
 */
export function useSemester() {
  const t = useTranslations('common.academicSemester');

  const formatSemester = useCallback<SemesterLabelFormatter>(
    ({ term, academicYear }) =>
      t(TERM_MESSAGE_KEY[term], {
        start: academicYear,
        end: academicYear + 1,
      }),
    [t],
  );

  const getSemesterLabel = useCallback(
    (code?: string | null): string => {
      const info = parseSemesterCode(code);
      return info ? formatSemester(info) : t('unknown');
    },
    [formatSemester, t],
  );

  const getSemesterOptions = useCallback(
    (count = 8, extraCode?: string | null): SemesterOption[] => {
      const options: SemesterOption[] = getRecentAcademicSemesters(count).map((info) => ({
        ...info,
        label: formatSemester(info),
      }));

      if (extraCode && !options.some((option) => option.code === extraCode)) {
        const extraInfo = parseSemesterCode(extraCode);
        if (extraInfo) {
          options.unshift({ ...extraInfo, label: formatSemester(extraInfo) });
        }
      }

      return options;
    },
    [formatSemester],
  );

  return useMemo(
    () => ({ formatSemester, getSemesterLabel, getSemesterOptions }),
    [formatSemester, getSemesterLabel, getSemesterOptions],
  );
}

export default useSemester;
