'use client';

import {
  CheckCircle2,
  Clock,
  MessageSquareCode,
  Radio,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/shared';

export interface ChannelsStatsProps {
  stats: {
    total: number;
    active: number;
    backfilling: number;
    totalCollected: number;
  };
}

export const ChannelsStats = ({ stats }: ChannelsStatsProps) => {
  const t = useTranslations('crawler.channels');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Channels */}
      <StatCard
        title={t('stats.totalChannels')}
        value={stats.total}
        icon={Radio}
        variant="neutral"
      />

      {/* 2. Active Channels */}
      <StatCard
        title={t('stats.activeChannels')}
        value={stats.active}
        icon={CheckCircle2}
        variant="success"
      />

      {/* 3. Backfilling Channels */}
      <StatCard
        title={t('stats.backfilling')}
        value={stats.backfilling}
        icon={Clock}
        variant="primary"
      />

      {/* 4. Total Collected */}
      <StatCard
        title={t('stats.totalCollected')}
        value={stats.totalCollected}
        icon={MessageSquareCode}
        variant="warning"
      />
    </div>
  );
};
