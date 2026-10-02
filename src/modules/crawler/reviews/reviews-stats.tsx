'use client';

import {
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquareCode,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/shared';
import type { CrawlerMessageStatus } from '@/apis/services/crawler';

export interface ReviewsStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    ignored?: number;
  };
  onSelectStatus?: (status: CrawlerMessageStatus | 'all') => void;
  activeStatus?: CrawlerMessageStatus | 'all';
}

export const ReviewsStats = ({
  stats,
  onSelectStatus,
  activeStatus,
}: ReviewsStatsProps) => {
  const t = useTranslations('crawler.reviews');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Pending Reviews */}
      <div
        className={`cursor-pointer transition-all ${
          activeStatus === 'pending' ? 'ring-2 ring-warning-500 rounded-2xl' : ''
        }`}
        onClick={() => onSelectStatus?.('pending')}
      >
        <StatCard
          title={t('stats.pending')}
          value={stats.pending}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* 2. Approved Reviews */}
      <div
        className={`cursor-pointer transition-all ${
          activeStatus === 'approved' ? 'ring-2 ring-success-500 rounded-2xl' : ''
        }`}
        onClick={() => onSelectStatus?.('approved')}
      >
        <StatCard
          title={t('stats.approved')}
          value={stats.approved}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* 3. Rejected Reviews */}
      <div
        className={`cursor-pointer transition-all ${
          activeStatus === 'rejected' ? 'ring-2 ring-danger-500 rounded-2xl' : ''
        }`}
        onClick={() => onSelectStatus?.('rejected')}
      >
        <StatCard
          title={t('stats.rejected')}
          value={stats.rejected}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* 4. Ignored / Miscellaneous */}
      <div
        className={`cursor-pointer transition-all ${
          activeStatus === 'ignored' ? 'ring-2 ring-neutral-700 rounded-2xl' : ''
        }`}
        onClick={() => onSelectStatus?.('ignored')}
      >
        <StatCard
          title={t('stats.ignored')}
          value={stats.ignored ?? 0}
          icon={HelpCircle}
          variant="neutral"
        />
      </div>

      {/* 5. Total Messages */}
      <div
        className={`cursor-pointer transition-all ${
          activeStatus === 'all' ? 'ring-2 ring-primary-500 rounded-2xl' : ''
        }`}
        onClick={() => onSelectStatus?.('all')}
      >
        <StatCard
          title={t('stats.total')}
          value={stats.total}
          icon={MessageSquareCode}
          variant="neutral"
        />
      </div>
    </div>
  );
};
