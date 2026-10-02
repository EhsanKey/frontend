'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Layers,
  Sparkles,
  Wrench,
  ShieldCheck,
  GitBranch,
  Gauge,
} from 'lucide-react';
import type { ISystemPipelineSpec } from '@/models';

interface PipelineMetricsProps {
  spec: ISystemPipelineSpec;
}

export const PipelineMetrics = ({ spec }: PipelineMetricsProps) => {
  const t = useTranslations('botFlow');
  const nf = useMemo(() => new Intl.NumberFormat('fa-IR'), []);

  const metricCards = [
    {
      id: 'stages',
      title: t('stats.stages'),
      value: nf.format(spec.stats.totalStages),
      desc: t('stats.stagesDesc'),
      icon: Layers,
      cardBorder: 'border-blue-300 dark:border-blue-500/30',
      badgeColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40',
      gradient: 'from-blue-500/10 via-background to-background',
    },
    {
      id: 'intents',
      title: t('stats.intents'),
      value: nf.format(spec.stats.totalIntents),
      desc: t('stats.intentsDesc'),
      icon: Sparkles,
      cardBorder: 'border-purple-300 dark:border-purple-500/30',
      badgeColor: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40',
      gradient: 'from-purple-500/10 via-background to-background',
    },
    {
      id: 'tools',
      title: t('stats.tools'),
      value: nf.format(spec.stats.totalTools),
      desc: t('stats.toolsDesc'),
      icon: Wrench,
      cardBorder: 'border-emerald-300 dark:border-emerald-500/30',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40',
      gradient: 'from-emerald-500/10 via-background to-background',
    },
    {
      id: 'grounded',
      title: t('stats.grounded'),
      value: `${nf.format(100)}%`,
      desc: t('stats.groundedDesc'),
      icon: ShieldCheck,
      cardBorder: 'border-amber-300 dark:border-amber-500/30',
      badgeColor: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
      gradient: 'from-amber-500/10 via-background to-background',
    },
    {
      id: 'fsm',
      title: t('stats.fsm'),
      value: nf.format(spec.stats.totalFsmFlows),
      desc: t('stats.fsmDesc'),
      icon: GitBranch,
      cardBorder: 'border-cyan-300 dark:border-cyan-500/30',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40',
      gradient: 'from-cyan-500/10 via-background to-background',
    },
    {
      id: 'rateLimiter',
      title: t('stats.rateLimiter'),
      value: nf.format(spec.rateLimiter?.maxMessages ?? 12),
      desc: t('stats.rateLimiterDesc'),
      icon: Gauge,
      cardBorder: 'border-rose-300 dark:border-rose-500/30',
      badgeColor: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40',
      gradient: 'from-rose-500/10 via-background to-background',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metricCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.cardBorder} p-3.5 backdrop-blur-md transition-all hover:scale-[1.02] hover:shadow-md bg-card`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-default-700 dark:text-default-300 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.badgeColor}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-default-950 dark:text-white mb-1">
              {card.value}
            </div>
            <p className="text-[10.5px] font-medium text-default-600 dark:text-default-400 line-clamp-1 leading-relaxed">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
