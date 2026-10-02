'use client';

import { Activity, Database, GraduationCap, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import type { IAiCacheStats } from '@/models';

interface CacheStatsProps {
  stats?: IAiCacheStats | null;
  isLoading?: boolean;
}

export const CacheStats = ({ stats, isLoading = false }: CacheStatsProps) => {
  const t = useTranslations('cache.stats');

  const totalEntries = stats?.totalCachedEntries ?? 0;
  const totalHits = stats?.totalHits ?? 0;
  const tokensSaved = stats?.estimatedTokensSaved ?? 0;
  const topProf = stats?.topProfessors?.[0];

  const cards = [
    {
      id: 'entries',
      label: t('totalEntries'),
      value: isLoading ? '...' : totalEntries.toLocaleString('fa-IR'),
      unit: t('items'),
      icon: Database,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      id: 'hits',
      label: t('totalHits'),
      value: isLoading ? '...' : totalHits.toLocaleString('fa-IR'),
      unit: t('times'),
      icon: Activity,
      iconColor: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      id: 'tokens',
      label: t('tokensSaved'),
      value: isLoading
        ? '...'
        : tokensSaved >= 1_000_000
          ? `${(tokensSaved / 1_000_000).toFixed(1)}M`
          : tokensSaved.toLocaleString('fa-IR'),
      unit: t('tokens'),
      icon: Sparkles,
      iconColor: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      id: 'topProf',
      label: t('topProfessors'),
      value: isLoading ? '...' : topProf ? topProf.professorName : '-',
      unit: topProf ? t('hitsCount', { count: topProf.hitCount.toLocaleString('fa-IR') }) : '',
      icon: GraduationCap,
      iconColor: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all hover:shadow-xs"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.iconColor}`}>
              <Icon className={ICON_SIZE_CLASS.md} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption text-neutral-500 truncate">{card.label}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-h3 font-bold text-neutral-900 tracking-tight truncate">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-caption text-neutral-500 shrink-0">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
