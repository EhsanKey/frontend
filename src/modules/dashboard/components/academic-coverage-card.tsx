'use client';

import { Button, Card, Chip } from '@heroui/react';
import {
  ArrowLeft,
  BookOpen,
  Building,
  GraduationCap,
  Library,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import type { IAnalyticsOverview } from '@/models';

interface AcademicCoverageCardProps {
  academic?: IAnalyticsOverview['academic'];
}

export const AcademicCoverageCard = ({ academic }: AcademicCoverageCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const totalProfessors = academic?.totalProfessors ?? 0;
  const reviewedProfessors = academic?.professorsWithReviewsCount ?? 0;
  const coverageRate =
    totalProfessors > 0
      ? Math.min(100, Math.round((reviewedProfessors / totalProfessors) * 100))
      : 0;

  const stats = [
    {
      label: t('academic.universities'),
      value: academic?.totalUniversities,
      icon: Building,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: t('academic.campuses'),
      value: academic?.totalCampuses,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: t('academic.majors'),
      value: academic?.totalMajors,
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: t('academic.courses'),
      value: academic?.totalCourses,
      icon: Library,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h3 className="text-title font-bold text-neutral-900">
              {t('academic.title')}
            </h3>
            <p className="text-caption text-neutral-500">
              {t('academic.subtitle')}
            </p>
          </div>
        </div>

        <Link href={ROUTES.professors}>
          <Button size="sm" variant="ghost" className="text-primary-600 font-medium">
            <span>{t('professors.viewAll')}</span>
            <ArrowLeft className="size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="mt-5 space-y-5">
        {/* Coverage Highlight Banner */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-primary-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-600" />
              <span className="text-body-sm font-bold text-indigo-950">
                {t('academic.professorsWithReviews')}
              </span>
            </div>
            <Chip size="sm" variant="secondary" className="bg-indigo-100 text-indigo-800 font-bold">
              {coverageRate}٪
            </Chip>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-primary-600 transition-all duration-500"
              style={{ width: `${coverageRate}%` }}
            />
          </div>

          <p className="mt-2 text-caption text-neutral-600">
            {t('academic.coverageRate', {
              rate: coverageRate,
              reviewed: formatNumber(reviewedProfessors),
              total: formatNumber(totalProfessors),
            })}
          </p>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 transition-colors hover:bg-neutral-50"
              >
                <div className={`rounded-lg border p-2 ${item.color}`}>
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-caption text-neutral-500">{item.label}</p>
                  <p className="text-h3 font-bold text-neutral-900">
                    {formatNumber(item.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Teaching Count Footer */}
        <div className="flex items-center justify-between rounded-lg bg-neutral-100/70 px-4 py-2.5 text-caption">
          <span className="text-neutral-600 font-medium">
            {t('academic.teachings')}:
          </span>
          <span className="font-bold text-neutral-900">
            {formatNumber(academic?.totalTeachings)}
          </span>
        </div>
      </div>
    </Card>
  );
};
