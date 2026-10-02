'use client';

import { Button, Card, Chip } from '@heroui/react';
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import type { IAIModelsAnalytics } from '@/models';

interface AIModelsTelemetryCardProps {
  aiModels?: IAIModelsAnalytics;
}

export const AIModelsTelemetryCard = ({ aiModels }: AIModelsTelemetryCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const totalModels = aiModels?.totalModels ?? 0;
  const activeModels = aiModels?.activeModels ?? 0;
  const totalRequests = aiModels?.totalRequests ?? 0;
  const totalErrors = aiModels?.totalErrors ?? 0;
  const overallSuccessRate = aiModels?.overallSuccessRate ?? 100;
  const todayErrors = aiModels?.todayErrors ?? 0;
  const models = aiModels?.models ?? [];

  const getScopeBadge = (scope: string) => {
    switch (scope) {
      case 'both':
        return 'پلنر و پاسخ';
      case 'planner':
        return 'پلنر هوشمند';
      case 'answer':
        return 'پاسخ‌دهی نهایی';
      default:
        return scope;
    }
  };

  const getStatusColor = (status: string, isEnabled: boolean) => {
    if (!isEnabled || status === 'disabled') {
      return {
        bg: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        dot: 'bg-neutral-400',
        label: 'غیرفعال',
      };
    }
    if (status === 'limited') {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
        label: 'محدودیت سهمیه',
      };
    }
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'فعال و آماده',
    };
  };

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 text-white shadow-xs">
            <Bot className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-title font-bold text-neutral-900">
                {t('aiModels.title')}
              </h3>
              <Chip
                size="sm"
                variant="secondary"
                className="bg-indigo-50 text-indigo-700 font-semibold"
              >
                {t('aiModels.activeCount', {
                  active: formatNumber(activeModels),
                  total: formatNumber(totalModels),
                })}
              </Chip>
            </div>
            <p className="text-caption text-neutral-500">
              {t('aiModels.subtitle')}
            </p>
          </div>
        </div>

        <Link href={ROUTES.aiModels}>
          <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 font-medium">
            <span>{t('aiModels.manageModels')}</span>
            <ArrowLeft className="size-3.5" />
          </Button>
        </Link>
      </div>

      {/* Summary KPI Strip */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Cpu className="size-4" />
            </div>
            <div>
              <p className="text-caption text-neutral-500">{t('aiModels.totalRequests')}</p>
              <p className="text-body font-bold text-neutral-900">
                {formatNumber(totalRequests)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <p className="text-caption text-neutral-500">پایداری کل</p>
              <p className="text-body font-bold text-emerald-700">
                {formatNumber(overallSuccessRate)}٪
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between rounded-xl border p-3.5 ${
            todayErrors > 0
              ? 'border-rose-200 bg-rose-50/50'
              : 'border-neutral-200/70 bg-neutral-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`rounded-lg p-2 ${
                todayErrors > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {todayErrors > 0 ? (
                <AlertTriangle className="size-4" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
            </div>
            <div>
              <p className="text-caption text-neutral-500">خطاهای امروز AI</p>
              <p
                className={`text-body font-bold ${
                  todayErrors > 0 ? 'text-rose-600' : 'text-neutral-900'
                }`}
              >
                {formatNumber(todayErrors)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Workload Breakdown List */}
      <div className="mt-5 space-y-3.5">
        <div className="flex items-center justify-between text-body-sm font-semibold text-neutral-800">
          <span className="flex items-center gap-1.5">
            <Layers className="size-4 text-indigo-500" />
            توزیع بار کاری و فراخوانی مدل‌ها
          </span>
          <span className="text-caption text-neutral-500">
            {formatNumber(models.length)} مدل ثبت‌شده
          </span>
        </div>

        {models.length > 0 ? (
          <div className="space-y-3">
            {models.map((model) => {
              const statusCfg = getStatusColor(model.status, model.isEnabled);
              return (
                <div
                  key={model.id}
                  className="rounded-xl border border-neutral-200/80 bg-white p-3.5 transition-all hover:border-indigo-200 hover:shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-bold text-neutral-900">
                        {model.name}
                      </span>
                      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600">
                        {model.model}
                      </span>
                      <span className="text-caption text-neutral-400">
                        ({model.providerName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-caption font-medium text-indigo-700">
                        {getScopeBadge(model.scope)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-caption font-medium ${statusCfg.bg}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar of Workload */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-caption text-neutral-500 mb-1">
                      <span>
                        سهم پردازش: {formatNumber(model.workloadPercentage)}٪ ({formatNumber(model.requestCount)} درخواست)
                      </span>
                      <span className="font-medium text-emerald-600">
                        موفقیت: {formatNumber(model.successRate)}٪
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${Math.max(model.workloadPercentage, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-body-sm text-neutral-400">
            {t('aiModels.noModels')}
          </div>
        )}
      </div>
    </Card>
  );
};
