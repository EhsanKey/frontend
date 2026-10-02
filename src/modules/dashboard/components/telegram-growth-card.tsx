'use client';

import { Card, Chip } from '@heroui/react';
import {
  CheckCircle2,
  MessageCircle,
  MessagesSquare,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { IAnalyticsOverview } from '@/models';

interface TelegramGrowthCardProps {
  telegram?: IAnalyticsOverview['telegram'];
}

export const TelegramGrowthCard = ({ telegram }: TelegramGrowthCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const totalUsers = telegram?.totalUsers ?? 0;
  const profileCompleted = telegram?.profileCompletedUsers ?? 0;
  const completionRate =
    totalUsers > 0
      ? Math.min(100, Math.round((profileCompleted / totalUsers) * 100))
      : 0;

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
            <Send className="size-5" />
          </div>
          <div>
            <h3 className="text-title font-bold text-neutral-900">
              {t('telegram.title')}
            </h3>
            <p className="text-caption text-neutral-500">
              {t('telegram.subtitle')}
            </p>
          </div>
        </div>

        <Chip size="sm" variant="secondary" className="bg-sky-50 text-sky-700 font-semibold">
          {formatNumber(telegram?.activeGroups)} {t('telegram.activeGroups')}
        </Chip>
      </div>

      <div className="mt-5 space-y-5">
        {/* Profile Completion Bar */}
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-sky-600" />
              <span className="text-body-sm font-bold text-sky-950">
                {t('telegram.profileCompleted')}
              </span>
            </div>
            <span className="text-caption font-bold text-sky-700">
              {completionRate}٪
            </span>
          </div>

          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/80">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="mt-2 text-caption text-neutral-600">
            {t('telegram.completionRate', { rate: completionRate })} (
            {formatNumber(profileCompleted)} از {formatNumber(totalUsers)})
          </p>
        </div>

        {/* 4 Metrics in Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3.5">
            <div className="flex items-center gap-2 text-neutral-500">
              <Users className="size-4 text-primary-500" />
              <span className="text-caption">{t('telegram.totalUsers')}</span>
            </div>
            <p className="mt-1 text-h3 font-bold text-neutral-900">
              {formatNumber(telegram?.totalUsers)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3.5">
            <div className="flex items-center gap-2 text-neutral-500">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span className="text-caption">{t('telegram.groups')}</span>
            </div>
            <p className="mt-1 text-h3 font-bold text-neutral-900">
              {formatNumber(telegram?.configuredGroups)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3.5">
            <div className="flex items-center gap-2 text-neutral-500">
              <MessageCircle className="size-4 text-amber-500" />
              <span className="text-caption">{t('telegram.conversations')}</span>
            </div>
            <p className="mt-1 text-h3 font-bold text-neutral-900">
              {formatNumber(telegram?.totalConversations)}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3.5">
            <div className="flex items-center gap-2 text-neutral-500">
              <MessagesSquare className="size-4 text-indigo-500" />
              <span className="text-caption">{t('telegram.messages')}</span>
            </div>
            <p className="mt-1 text-h3 font-bold text-neutral-900">
              {formatNumber(telegram?.totalMessages)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
