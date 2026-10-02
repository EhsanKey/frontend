'use client';

import { Card, Chip } from '@heroui/react';
import {
  Ban,
  CheckCircle2,
  Clock,
  Compass,
  FileQuestion,
  MessageCircle,
  Radio,
  Send,
  TrendingUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { IAnalyticsOverview } from '@/models';

interface InquiryDistributionCardProps {
  inquiries?: IAnalyticsOverview['inquiries'];
}

export const InquiryDistributionCard = ({ inquiries }: InquiryDistributionCardProps) => {
  const t = useTranslations('dashboard');

  const formatNumber = (num?: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num ?? 0);
  };

  const channelPrivate = inquiries?.byChannel?.private ?? 0;
  const channelGroup = inquiries?.byChannel?.group ?? 0;
  const totalChannels = channelPrivate + channelGroup || 1;
  const privatePercent = Math.round((channelPrivate / totalChannels) * 100);
  const groupPercent = 100 - privatePercent;

  const typeReview = inquiries?.byType?.review ?? 0;
  const typeResource = inquiries?.byType?.resource ?? 0;
  const totalTypes = typeReview + typeResource || 1;
  const reviewPercent = Math.round((typeReview / totalTypes) * 100);
  const resourcePercent = 100 - reviewPercent;

  const notified = inquiries?.notifiedFollowUps ?? 0;
  const pending = inquiries?.pendingFollowUps ?? 0;
  const converted = inquiries?.convertedFollowUps ?? 0;
  const optedOut = inquiries?.optedOutFollowUps ?? 0;
  const round1Pending = inquiries?.round1Pending ?? pending;
  const round2Pending = inquiries?.round2Pending ?? 0;
  const conversionRate = inquiries?.conversionRate ?? 0;
  const totalFollowUps = notified + pending || 1;
  const notifiedPercent = Math.round((notified / totalFollowUps) * 100);

  return (
    <Card className="h-full border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600">
            <Compass className="size-5" />
          </div>
          <div>
            <h3 className="text-title font-bold text-neutral-900">
              {t('inquiryBreakdown.title')}
            </h3>
            <p className="text-caption text-neutral-500">
              {t('inquiryBreakdown.subtitle')}
            </p>
          </div>
        </div>

        <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-semibold">
          {formatNumber(inquiries?.total)} {t('stats.outOfInquiries', { count: '' }).trim()}
        </Chip>
      </div>

      <div className="mt-5 space-y-6">
        {/* 1. Inquiries by Channel: Private vs Group */}
        <div>
          <div className="mb-2 flex items-center justify-between text-body-sm font-semibold text-neutral-800">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4 text-primary-500" />
              {t('inquiryBreakdown.channelTitle')}
            </span>
            <span className="text-caption text-neutral-500">
              {privatePercent}٪ / {groupPercent}٪
            </span>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 flex p-0.5">
            <div
              className="h-full rounded-s-full bg-gradient-to-r from-primary-600 to-indigo-500 transition-all duration-500"
              style={{ width: `${privatePercent}%` }}
              title={`${t('inquiryBreakdown.privateChat')}: ${privatePercent}%`}
            />
            <div
              className="h-full rounded-e-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${groupPercent}%` }}
              title={`${t('inquiryBreakdown.groupChat')}: ${groupPercent}%`}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-caption">
            <div className="flex items-center justify-between rounded-lg bg-primary-50/60 p-2 px-3 border border-primary-100/60">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <span className="size-2 rounded-full bg-primary-600 inline-block" />
                {t('inquiryBreakdown.privateChat')}
              </span>
              <span className="font-bold text-primary-800">{formatNumber(channelPrivate)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-amber-50/60 p-2 px-3 border border-amber-100/60">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <span className="size-2 rounded-full bg-amber-500 inline-block" />
                {t('inquiryBreakdown.groupChat')}
              </span>
              <span className="font-bold text-amber-800">{formatNumber(channelGroup)}</span>
            </div>
          </div>
        </div>

        {/* 2. Inquiries by Type: Review vs Resource */}
        <div>
          <div className="mb-2 flex items-center justify-between text-body-sm font-semibold text-neutral-800">
            <span className="flex items-center gap-1.5">
              <FileQuestion className="size-4 text-emerald-500" />
              {t('inquiryBreakdown.typeTitle')}
            </span>
            <span className="text-caption text-neutral-500">
              {reviewPercent}٪ / {resourcePercent}٪
            </span>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 flex p-0.5">
            <div
              className="h-full rounded-s-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${reviewPercent}%` }}
              title={`${t('inquiryBreakdown.reviewType')}: ${reviewPercent}%`}
            />
            <div
              className="h-full rounded-e-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
              style={{ width: `${resourcePercent}%` }}
              title={`${t('inquiryBreakdown.resourceType')}: ${resourcePercent}%`}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-caption">
            <div className="flex items-center justify-between rounded-lg bg-emerald-50/60 p-2 px-3 border border-emerald-100/60">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                {t('inquiryBreakdown.reviewType')}
              </span>
              <span className="font-bold text-emerald-800">{formatNumber(typeReview)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-sky-50/60 p-2 px-3 border border-sky-100/60">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <span className="size-2 rounded-full bg-sky-500 inline-block" />
                {t('inquiryBreakdown.resourceType')}
              </span>
              <span className="font-bold text-sky-800">{formatNumber(typeResource)}</span>
            </div>
          </div>
        </div>

        {/* 3. Follow-up Campaign & Lifecycle Breakdown */}
        <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-caption font-semibold text-neutral-700">
              <Radio className="size-3.5 text-primary-600" />
              {t('inquiryBreakdown.followUpTitle')}
            </span>
            <Chip
              size="sm"
              variant="secondary"
              className={
                conversionRate > 0
                  ? 'bg-emerald-50 text-emerald-700 font-bold text-[11px]'
                  : 'bg-neutral-200/70 text-neutral-600 text-[11px]'
              }
            >
              <TrendingUp className="size-3 inline-block ml-1" />
              {conversionRate}٪ نرخ بازخورد
            </Chip>
          </div>

          {/* Delivery Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
              <span>{t('inquiryBreakdown.notified')}</span>
              <span className="font-bold text-primary-700">{notifiedPercent}٪</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-primary-600 transition-all duration-500"
                style={{ width: `${notifiedPercent}%` }}
              />
            </div>
          </div>

          {/* 4-Item Lifecycle Stat Cards */}
          <div className="grid grid-cols-2 gap-2 text-caption pt-1">
            <div className="flex items-center justify-between rounded-lg bg-emerald-50/80 p-2 px-2.5 border border-emerald-200/60">
              <span className="flex items-center gap-1 text-emerald-800 text-[11px]">
                <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                {t('inquiryBreakdown.converted')}
              </span>
              <span className="font-bold text-emerald-900">{formatNumber(converted)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-neutral-100/80 p-2 px-2.5 border border-neutral-200/60">
              <span className="flex items-center gap-1 text-neutral-700 text-[11px]" title="دانشجویانی که اعلام کردند با این استاد کلاس نداشته‌اند">
                <Ban className="size-3 text-neutral-500 shrink-0" />
                {t('inquiryBreakdown.optedOut')}
              </span>
              <span className="font-bold text-neutral-800">{formatNumber(optedOut)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-amber-50/80 p-2 px-2.5 border border-amber-200/60">
              <span className="flex items-center gap-1 text-amber-800 text-[11px]">
                <Send className="size-3 text-amber-600 shrink-0" />
                {t('inquiryBreakdown.round1')}
              </span>
              <span className="font-bold text-amber-900">{formatNumber(round1Pending)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-sky-50/80 p-2 px-2.5 border border-sky-200/60">
              <span className="flex items-center gap-1 text-sky-800 text-[11px]">
                <Clock className="size-3 text-sky-600 shrink-0" />
                {t('inquiryBreakdown.round2')}
              </span>
              <span className="font-bold text-sky-900">{formatNumber(round2Pending)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
