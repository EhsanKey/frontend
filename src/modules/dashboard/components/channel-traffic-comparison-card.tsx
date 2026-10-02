'use client';

import { Button, Card, Chip } from '@heroui/react';
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  MessagesSquare,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import type { IChannelUsageAnalytics } from '@/models';

interface ChannelTrafficComparisonCardProps {
  channelUsage?: IChannelUsageAnalytics;
}

export const ChannelTrafficComparisonCard = ({
  channelUsage,
}: ChannelTrafficComparisonCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const groupMessages = channelUsage?.messages?.group ?? 0;
  const privateMessages = channelUsage?.messages?.private ?? 0;
  const totalMessages = groupMessages + privateMessages;

  const hasTraffic = totalMessages > 0;
  const groupTrafficPercent = hasTraffic
    ? (channelUsage?.groupTrafficPercentage ?? Math.round((groupMessages / totalMessages) * 100))
    : 0;
  const privateTrafficPercent = hasTraffic ? 100 - groupTrafficPercent : 0;

  const isGroupDominant = hasTraffic && groupMessages > privateMessages;
  const isPrivateDominant = hasTraffic && privateMessages > groupMessages;

  const groupConversations = channelUsage?.conversations?.group ?? 0;
  const privateConversations = channelUsage?.conversations?.private ?? 0;
  const totalConversations = groupConversations + privateConversations;
  const groupConvPercent =
    totalConversations > 0
      ? Math.round((groupConversations / totalConversations) * 100)
      : 0;
  const privateConvPercent = totalConversations > 0 ? 100 - groupConvPercent : 0;

  const groupInquiries = channelUsage?.inquiries?.group ?? 0;
  const privateInquiries = channelUsage?.inquiries?.private ?? 0;
  const totalInquiries = groupInquiries + privateInquiries;
  const groupInqPercent =
    totalInquiries > 0
      ? Math.round((groupInquiries / totalInquiries) * 100)
      : 0;
  const privateInqPercent = totalInquiries > 0 ? 100 - groupInqPercent : 0;

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 text-white shadow-xs">
            <MessagesSquare className="size-5" />
          </div>
          <div>
            <h3 className="text-title font-bold text-neutral-900">
              {t('channelTraffic.title')}
            </h3>
            <p className="text-caption text-neutral-500">
              {t('channelTraffic.subtitle')}
            </p>
          </div>
        </div>

        <Link href={ROUTES.telegram}>
          <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800 font-medium">
            <span>{t('stats.viewTelegram')}</span>
            <ArrowLeft className="size-3.5" />
          </Button>
        </Link>
      </div>

      {/* Dominant Channel Insight Pill */}
      <div className="mt-5 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 to-orange-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700">
            {!hasTraffic ? (
              <MessagesSquare className="size-5" />
            ) : isGroupDominant ? (
              <Users className="size-5" />
            ) : isPrivateDominant ? (
              <User className="size-5" />
            ) : (
              <MessagesSquare className="size-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-caption font-semibold text-amber-900">
              {!hasTraffic
                ? t('channelTraffic.noTraffic')
                : isGroupDominant
                ? t('channelTraffic.groupDominant')
                : isPrivateDominant
                ? t('channelTraffic.privateDominant')
                : t('channelTraffic.equalDominant')}
            </p>
            <p className="mt-0.5 text-caption text-amber-700/90">
              {!hasTraffic
                ? t('channelTraffic.noTrafficShare')
                : t('channelTraffic.trafficShare', {
                    group: formatNumber(groupTrafficPercent),
                    private: formatNumber(privateTrafficPercent),
                  })}
            </p>
          </div>
        </div>

        {/* Dual Segment Main Progress Bar */}
        <div className="mt-3.5">
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-neutral-200/70 p-0.5 flex">
            {hasTraffic ? (
              <>
                <div
                  className="h-full rounded-s-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${groupTrafficPercent}%` }}
                  title={`گروه‌ها: ${groupTrafficPercent}%`}
                />
                <div
                  className="h-full rounded-e-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${privateTrafficPercent}%` }}
                  title={`چت خصوصی: ${privateTrafficPercent}%`}
                />
              </>
            ) : (
              <div className="h-full w-full rounded-full bg-neutral-200/50" />
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-caption font-medium">
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="size-2.5 rounded-full bg-amber-500" />
              {t('channelTraffic.groupTraffic')}: {formatNumber(groupTrafficPercent)}٪ ({formatNumber(groupMessages)} پیام)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-800">
              <span className="size-2.5 rounded-full bg-indigo-600" />
              {t('channelTraffic.privateTraffic')}: {formatNumber(privateTrafficPercent)}٪ ({formatNumber(privateMessages)} پیام)
            </span>
          </div>
        </div>
      </div>

      {/* 3 Detailed Metric Comparative Cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* 1. Messages */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold text-neutral-700 flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-neutral-500" />
              {t('channelTraffic.messages')}
            </span>
            <span className="text-caption text-neutral-400 font-mono">
              {formatNumber(totalMessages)}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-caption font-semibold">
            <span className="text-amber-700">{formatNumber(groupMessages)} گروه</span>
            <span className="text-indigo-700">{formatNumber(privateMessages)} پی‌وی</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 flex">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${groupTrafficPercent}%` }}
            />
            <div
              className="h-full bg-indigo-600"
              style={{ width: `${privateTrafficPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Conversations */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold text-neutral-700 flex items-center gap-1.5">
              <Users className="size-3.5 text-neutral-500" />
              {t('channelTraffic.conversations')}
            </span>
            <span className="text-caption text-neutral-400 font-mono">
              {formatNumber(totalConversations)}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-caption font-semibold">
            <span className="text-amber-700">{formatNumber(groupConversations)} گروه</span>
            <span className="text-indigo-700">{formatNumber(privateConversations)} پی‌وی</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 flex">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${groupConvPercent}%` }}
            />
            <div
              className="h-full bg-indigo-600"
              style={{ width: `${privateConvPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Inquiries */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold text-neutral-700 flex items-center gap-1.5">
              <HelpCircle className="size-3.5 text-neutral-500" />
              {t('channelTraffic.inquiries')}
            </span>
            <span className="text-caption text-neutral-400 font-mono">
              {formatNumber(totalInquiries)}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-caption font-semibold">
            <span className="text-amber-700">{formatNumber(groupInquiries)} گروه</span>
            <span className="text-indigo-700">{formatNumber(privateInquiries)} پی‌وی</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 flex">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${groupInqPercent}%` }}
            />
            <div
              className="h-full bg-indigo-600"
              style={{ width: `${privateInqPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
