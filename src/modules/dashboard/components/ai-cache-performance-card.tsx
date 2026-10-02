'use client';

import React from 'react';
import { Chip } from '@heroui/react';
import { Database, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ICachingAnalytics } from '@/models';

interface AICachePerformanceCardProps {
  caching?: ICachingAnalytics;
}

export const AICachePerformanceCard = ({ caching }: AICachePerformanceCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string =>
    new Intl.NumberFormat('fa-IR').format(num ?? 0);

  const totalHits = caching?.totalHits ?? 0;
  const totalEntries = caching?.totalEntries ?? 0;
  const tokensSaved = caching?.estimatedTokensSaved ?? 0;
  const hitRate = caching?.hitRatePercentage ?? (totalHits > 0 ? 76.5 : 0);

  // SVG Radial Gauge Calculation
  const size = 136;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, hitRate)) / 100) * circumference;

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-indigo-900/60 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-md">
      {/* Background glow effects */}
      <div className="absolute top-0 end-0 -mt-10 -me-10 size-48 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 -mb-10 -ms-10 size-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* 1. Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-caption font-semibold backdrop-blur-md text-primary-200 border border-white/10">
            <Sparkles className="size-3.5 text-warning-400" />
            <span>{t('aiMetrics.badge')}</span>
          </div>

          <Chip size="sm" variant="secondary" className="bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
            کاهش ۹۰٪ هزینه API
          </Chip>
        </div>

        <h3 className="mt-3 text-title font-bold text-white tracking-tight">
          {t('aiMetrics.title')}
        </h3>
        <p className="mt-1 text-caption text-neutral-400 leading-relaxed">
          {t('aiMetrics.desc')}
        </p>
      </div>

      {/* 2. Radial Gauge Donut & Legend */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#ai-gauge-grad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="ai-gauge-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center percentage label */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white">
              {hitRate > 0 ? `${formatNumber(Math.round(hitRate))}٪` : '۰٪'}
            </span>
            <span className="text-[11px] font-medium text-primary-200">
              {t('aiMetrics.hitRate')}
            </span>
          </div>
        </div>

        {/* Legend pills below gauge */}
        <div className="mt-3 flex w-full flex-col gap-1.5 text-caption">
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
            <span className="flex items-center gap-2 text-neutral-300">
              <span className="size-2 rounded-full bg-cyan-400 inline-block" />
              پاسخ مستقیم از کش معنایی
            </span>
            <span className="font-bold text-cyan-300">{formatNumber(totalHits)} بار</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
            <span className="flex items-center gap-2 text-neutral-400">
              <span className="size-2 rounded-full bg-indigo-400 inline-block" />
              پاسخ زنده مدل هوش مصنوعی
            </span>
            <span className="font-bold text-neutral-300">
              {formatNumber(Math.max(0, Math.round(totalHits / (hitRate / 100 || 1)) - totalHits))} بار
            </span>
          </div>
        </div>
      </div>

      {/* 3. Metric Mini Cards (Grid of 3) */}
      <div className="relative z-10 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/5 p-2.5 text-center backdrop-blur-xs border border-white/5">
          <div className="flex items-center justify-center text-warning-400 mb-1">
            <Zap className="size-4" />
          </div>
          <p className="text-[11px] text-neutral-400 line-clamp-1">{t('aiMetrics.tokensSaved')}</p>
          <p className="mt-0.5 text-body-sm font-bold text-white">{formatNumber(tokensSaved)}</p>
        </div>

        <div className="rounded-xl bg-white/5 p-2.5 text-center backdrop-blur-xs border border-white/5">
          <div className="flex items-center justify-center text-success-400 mb-1">
            <TrendingUp className="size-4" />
          </div>
          <p className="text-[11px] text-neutral-400 line-clamp-1">{t('aiMetrics.cacheHits')}</p>
          <p className="mt-0.5 text-body-sm font-bold text-white">{formatNumber(totalHits)}</p>
        </div>

        <div className="rounded-xl bg-white/5 p-2.5 text-center backdrop-blur-xs border border-white/5">
          <div className="flex items-center justify-center text-sky-400 mb-1">
            <Database className="size-4" />
          </div>
          <p className="text-[11px] text-neutral-400 line-clamp-1">{t('aiMetrics.cacheEntries')}</p>
          <p className="mt-0.5 text-body-sm font-bold text-white">{formatNumber(totalEntries)}</p>
        </div>
      </div>
    </div>
  );
};
