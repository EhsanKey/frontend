'use client';

import { Button, Card, Chip } from '@heroui/react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cpu,
  Server,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import type { IAnalyticsOverview } from '@/models';

interface SystemHealthCardProps {
  errors?: IAnalyticsOverview['errors'];
}

export const SystemHealthCard = ({ errors }: SystemHealthCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const total = errors?.total ?? 0;
  const resolved = errors?.resolved ?? 0;
  const unresolved = errors?.unresolved ?? 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  const isHealthy = unresolved === 0;

  const aiPlannerErrors = errors?.bySource?.ai_planner ?? 0;
  const aiAnswerErrors = errors?.bySource?.ai_answer ?? 0;
  const systemErrors = errors?.bySource?.system ?? 0;

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`rounded-xl p-2.5 ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="text-title font-bold text-neutral-900">
              {t('systemHealth.title')}
            </h3>
            <p className="text-caption text-neutral-500">
              {t('systemHealth.subtitle')}
            </p>
          </div>
        </div>

        <Link href={ROUTES.errors}>
          <Button size="sm" variant="ghost" className="text-primary-600 font-medium">
            <span>{t('stats.viewErrors')}</span>
            <ArrowLeft className="size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="mt-5 space-y-5">
        {/* Health status banner */}
        <div
          className={`rounded-xl border p-4 ${
            isHealthy
              ? 'border-emerald-200 bg-emerald-50/50'
              : 'border-rose-200 bg-rose-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isHealthy ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-5 text-rose-600" />
              )}
              <span className="text-body-sm font-bold text-neutral-900">
                {isHealthy ? t('systemHealth.healthy') : t('systemHealth.unresolved')}
              </span>
            </div>

            <Chip
              size="sm"
              variant="secondary"
              className={
                isHealthy
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-rose-100 text-rose-800 font-bold'
              }
            >
              {isHealthy ? '100٪' : `${formatNumber(unresolved)} مورد`}
            </Chip>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${resolutionRate}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-caption text-neutral-600">
            <span>{t('systemHealth.resolutionRate', { rate: resolutionRate })}</span>
            <span>
              {t('systemHealth.resolved')}: {formatNumber(resolved)} از {formatNumber(total)}
            </span>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
            <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-1.5">
              <Bot className="size-4" />
            </div>
            <p className="text-caption text-neutral-500 font-medium line-clamp-1">
              هوش پلنر
            </p>
            <p className="mt-0.5 text-body-sm font-bold text-neutral-900">
              {formatNumber(aiPlannerErrors)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
            <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 mb-1.5">
              <Sparkles className="size-4" />
            </div>
            <p className="text-caption text-neutral-500 font-medium line-clamp-1">
              پاسخ هوش
            </p>
            <p className="mt-0.5 text-body-sm font-bold text-neutral-900">
              {formatNumber(aiAnswerErrors)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
            <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-1.5">
              <Server className="size-4" />
            </div>
            <p className="text-caption text-neutral-500 font-medium line-clamp-1">
              سیستم
            </p>
            <p className="mt-0.5 text-body-sm font-bold text-neutral-900">
              {formatNumber(systemErrors)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
