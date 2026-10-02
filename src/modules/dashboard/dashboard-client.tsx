'use client';

import { Button, Card, Chip } from '@heroui/react';
import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  MessageSquareText,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, QUERY_KEYS, ROUTES } from '@/constants';
import { useAuth, useGetRequest } from '@/hooks';
import { clientAnalyticsServices } from '@/apis/services/analytics/client';
import { RoleGuard } from '@/components/shared';
import { hasPermission } from '@/utils';
import type { IAnalyticsOverview, IProfessorAnalytics } from '@/models';
import {
  AcademicCoverageCard,
  ActivityTrendChart,
  AICachePerformanceCard,
  AIModelsTelemetryCard,
  ChannelTrafficComparisonCard,
  InquiryDistributionCard,
  SystemHealthCard,
  TelegramGrowthCard,
} from './components';

interface DashboardClientProps {
  initialOverview?: IAnalyticsOverview;
  initialProfessors?: IProfessorAnalytics;
}

export const DashboardClient = ({
  initialOverview,
  initialProfessors,
}: DashboardClientProps) => {
  const t = useTranslations('dashboard');
  const { user } = useAuth();

  const canReadAnalytics = hasPermission(user, 'analytics:read');

  const { data: overview } = useGetRequest({
    queryKey: QUERY_KEYS.analytics.overview,
    requestFn: () => clientAnalyticsServices.getOverview(),
    initialData: initialOverview,
    enabled: canReadAnalytics,
  });

  const { data: profAnalytics } = useGetRequest({
    queryKey: QUERY_KEYS.analytics.professors(6),
    requestFn: () => clientAnalyticsServices.getProfessorAnalytics({ limit: 6 }),
    initialData: initialProfessors,
    enabled: canReadAnalytics,
  });

  const submissions = overview?.submissions;
  const inquiries = overview?.inquiries;
  const errors = overview?.errors;

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header welcome banner */}
      <div className="bg-surface flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 p-6 shadow-2xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h2 font-bold text-neutral-900">
              {t('welcome', { name: user?.name || t('defaultManager') })}
            </h1>
            <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
              {t('version')}
            </Chip>
          </div>
          <p className="mt-1.5 text-body-sm text-neutral-500">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={ROUTES.reviews}>
            <Button size="md" variant="primary">
              <MessageSquareText className={ICON_SIZE_CLASS.sm} />
              {t('actions.reviewFeedbacks')}
            </Button>
          </Link>
          <Link href={ROUTES.inquiries}>
            <Button size="md" variant="secondary">
              <BellRing className={ICON_SIZE_CLASS.sm} />
              {t('actions.followUpCampaign')}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Interactive Chart & AI Efficiency Row */}
      <RoleGuard
        permission="analytics:read"
        blurOnDenied
        blurMessage={t('blurMessages.analytics')}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 7-Day Activity Trends (2 Columns on large screens) */}
          <div className="lg:col-span-2">
            <ActivityTrendChart trends={overview?.activityTrends} />
          </div>

          {/* AI Cache Optimization Gauge & Cost Savings (1 Column) */}
          <div className="lg:col-span-1">
            <AICachePerformanceCard caching={overview?.caching} />
          </div>
        </div>
      </RoleGuard>

      {/* 3. Primary Metrics Grid (4 Stat Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Reviews */}
        <RoleGuard
          permission="reviews:read"
          blurOnDenied
          blurMessage={t('blurMessages.reviews')}
        >
          <Link href={ROUTES.reviews} className="group block h-full">
            <Card className="h-full border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-primary-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-neutral-500">{t('stats.reviewsPending')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-h2 font-bold text-neutral-900">
                      {formatNumber(submissions?.reviews?.pending)}
                    </span>
                    <span className="text-caption text-neutral-400">
                      {t('stats.outOfReviews', { count: formatNumber(submissions?.reviews?.total) })}
                    </span>
                  </div>
                </div>
                <div className="bg-warning-50 text-warning-600 rounded-xl p-3 group-hover:scale-105 transition-transform">
                  <Clock className={ICON_SIZE_CLASS.lg} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-caption text-primary-600 font-medium">
                <span>{t('stats.viewReviews')}</span>
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </Card>
          </Link>
        </RoleGuard>

        {/* Resources */}
        <RoleGuard
          permission="resources:read"
          blurOnDenied
          blurMessage={t('blurMessages.resources')}
        >
          <Link href={ROUTES.resources} className="group block h-full">
            <Card className="h-full border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-primary-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-neutral-500">{t('stats.resourcesPending')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-h2 font-bold text-neutral-900">
                      {formatNumber(submissions?.resources?.pending)}
                    </span>
                    <span className="text-caption text-neutral-400">
                      {t('stats.outOfResources', { count: formatNumber(submissions?.resources?.total) })}
                    </span>
                  </div>
                </div>
                <div className="bg-info-50 text-info-600 rounded-xl p-3 group-hover:scale-105 transition-transform">
                  <FileText className={ICON_SIZE_CLASS.lg} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-caption text-primary-600 font-medium">
                <span>{t('stats.publishTelegram')}</span>
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </Card>
          </Link>
        </RoleGuard>

        {/* Inquiries */}
        <RoleGuard
          permission="inquiries:read"
          blurOnDenied
          blurMessage={t('blurMessages.inquiries')}
        >
          <Link href={ROUTES.inquiries} className="group block h-full">
            <Card className="h-full border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-primary-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-neutral-500">{t('stats.followUpsPending')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-h2 font-bold text-primary-600">
                      {formatNumber(inquiries?.pendingFollowUps)}
                    </span>
                    <span className="text-caption text-neutral-400">
                      {t('stats.outOfInquiries', { count: formatNumber(inquiries?.total) })}
                    </span>
                  </div>
                </div>
                <div className="bg-primary-50 text-primary-600 rounded-xl p-3 group-hover:scale-105 transition-transform">
                  <BellRing className={ICON_SIZE_CLASS.lg} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-caption text-primary-600 font-medium">
                <span>{t('stats.sendNotifications')}</span>
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </Card>
          </Link>
        </RoleGuard>

        {/* System & AI Errors */}
        <RoleGuard
          permission="errors:read"
          blurOnDenied
          blurMessage={t('blurMessages.errors')}
        >
          <Link href={ROUTES.errors} className="group block h-full">
            <Card className="h-full border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-danger-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-neutral-500">{t('stats.errorsUnresolved')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span
                      className={`text-h2 font-bold ${
                        (errors?.unresolved ?? 0) > 0 ? 'text-danger-600' : 'text-neutral-900'
                      }`}
                    >
                      {formatNumber(errors?.unresolved)}
                    </span>
                    <span className="text-caption text-neutral-400">
                      {t('stats.outOfErrors', { count: formatNumber(errors?.total) })}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-3 group-hover:scale-105 transition-transform ${
                    (errors?.unresolved ?? 0) > 0
                      ? 'bg-danger-50 text-danger-600'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <AlertTriangle className={ICON_SIZE_CLASS.lg} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-caption text-primary-600 font-medium">
                <span>{t('stats.viewErrors')}</span>
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </Card>
          </Link>
        </RoleGuard>
      </div>

      {/* 4. AI Models Telemetry & Channel Traffic Breakdown (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Models Telemetry & Workload */}
        <RoleGuard
          permission="ai_models:read"
          blurOnDenied
          blurMessage={t('blurMessages.aiModels')}
        >
          <AIModelsTelemetryCard aiModels={overview?.aiModels} />
        </RoleGuard>

        {/* Telegram Traffic: Groups vs Private (PV) */}
        <RoleGuard
          permission="telegram:read"
          blurOnDenied
          blurMessage={t('blurMessages.telegram')}
        >
          <ChannelTrafficComparisonCard channelUsage={overview?.channelUsage} />
        </RoleGuard>
      </div>

      {/* 5. Community & Inquiry Analytics (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Telegram Community & Groups */}
        <RoleGuard
          permission="telegram:read"
          blurOnDenied
          blurMessage={t('blurMessages.telegram')}
        >
          <TelegramGrowthCard telegram={overview?.telegram} />
        </RoleGuard>

        {/* Student Inquiries Distribution */}
        <RoleGuard
          permission="inquiries:read"
          blurOnDenied
          blurMessage={t('blurMessages.inquiries')}
        >
          <InquiryDistributionCard inquiries={overview?.inquiries} />
        </RoleGuard>
      </div>

      {/* 5. Academic Structure & System Health (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Academic Coverage */}
        <RoleGuard
          permission="professors:read"
          blurOnDenied
          blurMessage={t('blurMessages.academic')}
        >
          <AcademicCoverageCard academic={overview?.academic} />
        </RoleGuard>

        {/* System & AI Health Monitor */}
        <RoleGuard
          permission="errors:read"
          blurOnDenied
          blurMessage={t('blurMessages.errors')}
        >
          <SystemHealthCard errors={overview?.errors} />
        </RoleGuard>
      </div>

      {/* 6. Professor Insights: Top Inquired vs Missing Coverage */}
      <RoleGuard
        permission="analytics:read"
        blurOnDenied
        blurMessage={t('blurMessages.professors')}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Inquired */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="text-title font-bold text-neutral-900">
                    {t('professors.topTitle')}
                  </h3>
                  <p className="text-caption text-neutral-500">
                    {t('professors.topSubtitle')}
                  </p>
                </div>
              </div>

              <Link href={ROUTES.professors}>
                <Button size="sm" variant="ghost" className="text-primary-600 font-medium">
                  {t('professors.viewAll')}
                </Button>
              </Link>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {profAnalytics?.topInquired && profAnalytics.topInquired.length > 0 ? (
                profAnalytics.topInquired.map((item, idx) => (
                  <div key={item.professorId} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full bg-neutral-100 text-caption font-bold text-neutral-600">
                        {idx + 1}
                      </span>
                      <span className="text-body-sm font-semibold text-neutral-900">
                        {item.professorName}
                      </span>
                    </div>
                    <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
                      {t('professors.inquiryCount', { count: formatNumber(item.inquiryCount) })}
                    </Chip>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-body-sm text-neutral-400">
                  {t('professors.empty')}
                </p>
              )}
            </div>
          </div>

          {/* Missing Coverage */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-warning-50 p-2 text-warning-600">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h3 className="text-title font-bold text-neutral-900">
                    {t('professors.missingTitle')}
                  </h3>
                  <p className="text-caption text-neutral-500">
                    {t('professors.missingSubtitle')}
                  </p>
                </div>
              </div>

              <Link href={ROUTES.inquiries}>
                <Button size="sm" variant="ghost" className="text-warning-700 font-medium">
                  {t('professors.inquiryCampaign')}
                </Button>
              </Link>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
              {profAnalytics?.missingCoverage && profAnalytics.missingCoverage.length > 0 ? (
                profAnalytics.missingCoverage.map((item) => (
                  <div key={item.professorId} className="flex items-center justify-between py-3">
                    <span className="text-body-sm font-semibold text-neutral-900">
                      {item.professorName}
                    </span>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 font-medium">
                        {t('professors.studentInquiries', { count: formatNumber(item.inquiryCount) })}
                      </Chip>
                      <span className="text-caption font-medium text-danger-500">
                        {t('professors.noReviews')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-body-sm text-neutral-400">
                  {t('professors.empty')}
                </p>
              )}
            </div>
          </div>
        </div>
      </RoleGuard>

      {/* 7. Quick Actions & Routine Operations */}
      <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6">
        <h3 className="text-title font-bold text-neutral-900">
          {t('quickActions.title')}
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoleGuard permission="reviews:read" blurOnDenied blurMessage={t('blurMessages.quickReviews')}>
            <Link href={ROUTES.reviews} className="block h-full">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs transition-all hover:border-primary-400 hover:shadow-xs">
                <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <span className="text-body-sm font-semibold text-neutral-800">
                  {t('quickActions.reviewPending', {
                    count: submissions?.reviews?.pending ?? 0,
                  })}
                </span>
              </div>
            </Link>
          </RoleGuard>

          <RoleGuard permission="resources:read" blurOnDenied blurMessage={t('blurMessages.quickResources')}>
            <Link href={ROUTES.resources} className="block h-full">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs transition-all hover:border-primary-400 hover:shadow-xs">
                <div className="rounded-lg bg-info-50 p-2 text-info-600">
                  <FileText className="size-5" />
                </div>
                <span className="text-body-sm font-semibold text-neutral-800">
                  {t('quickActions.resourcePending', {
                    count: submissions?.resources?.pending ?? 0,
                  })}
                </span>
              </div>
            </Link>
          </RoleGuard>

          <RoleGuard permission="inquiries:read" blurOnDenied blurMessage={t('blurMessages.quickInquiries')}>
            <Link href={ROUTES.inquiries} className="block h-full">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs transition-all hover:border-primary-400 hover:shadow-xs">
                <div className="rounded-lg bg-warning-50 p-2 text-warning-600">
                  <BellRing className="size-5" />
                </div>
                <span className="text-body-sm font-semibold text-neutral-800">
                  {t('quickActions.triggerInquiries', {
                    count: inquiries?.pendingFollowUps ?? 0,
                  })}
                </span>
              </div>
            </Link>
          </RoleGuard>

          <RoleGuard permission="professors:read" blurOnDenied blurMessage={t('blurMessages.quickProfessors')}>
            <Link href={ROUTES.professors} className="block h-full">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs transition-all hover:border-primary-400 hover:shadow-xs">
                <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                  <GraduationCap className="size-5" />
                </div>
                <span className="text-body-sm font-semibold text-neutral-800">
                  {t('quickActions.manageProfessors')}
                </span>
              </div>
            </Link>
          </RoleGuard>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
