'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Chip,
  Spinner,
  toast,
} from '@heroui/react';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientInquiriesServices } from '@/apis/services/inquiries';
import {
  InlineKeyboardBuilder,
  InputField,
  TelegramEditor,
  TelegramLivePreview,
} from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import type { InlineKeyboardRow, IInquiryTopic } from '@/models';

export const InquiriesCampaignClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const t = useTranslations('inquiries.campaign');
  const tInquiries = useTranslations('inquiries');
  const tModals = useTranslations('inquiries.modals');
  const tCommon = useTranslations('common');

  // Extract topicId or comma-separated topicIds from URL query
  const rawTopicIds = searchParams.get('topicIds') || searchParams.get('topicId') || '';
  const selectedTopicIds = useMemo(() => {
    return rawTopicIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rawTopicIds]);

  // Form State
  const [targetStage, setTargetStage] = useState<'all' | 'round1' | 'round2'>('all');
  const [includeOptOutButton, setIncludeOptOutButton] = useState<boolean>(true);
  const [limitOnePerUser, setLimitOnePerUser] = useState<boolean>(true);
  const [messageText, setMessageText] = useState<string>(t('defaultMessage'));
  const [parseMode, setParseMode] = useState<string>('HTML');
  const [recipientLimit, setRecipientLimit] = useState<string>('');
  const [inlineButtons, setInlineButtons] = useState<InlineKeyboardRow[]>([
    [
      {
        id: 'btn-inq-1',
        text: t('defaultButton'),
        url: '{deep_link}',
      },
    ],
  ]);

  // Fetch topics to get details on target audience
  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: QUERY_KEYS.inquiries.topics({ pageSize: 100 }),
    queryFn: () => clientInquiriesServices.getTopics({ pageSize: 100 }),
  });

  // Target Topics and Stats
  const targetTopics = useMemo(() => {
    const all = topicsData?.items ?? [];
    if (selectedTopicIds.length === 0) return all;
    return all.filter((t) => selectedTopicIds.includes(t.id));
  }, [topicsData, selectedTopicIds]);

  const targetStats = useMemo(() => {
    const totalStudents = targetTopics.reduce((sum, t) => sum + (t.uniqueStudentsCount || 0), 0);
    const round1Pending = targetTopics.reduce(
      (sum, t) => sum + (t.round1PendingCount ?? (t.pendingInquiriesCount || 0)),
      0,
    );
    const round2Pending = targetTopics.reduce(
      (sum, t) => sum + (t.round2PendingCount ?? 0),
      0,
    );
    const pendingStudents =
      targetStage === 'round1'
        ? round1Pending
        : targetStage === 'round2'
        ? round2Pending
        : round1Pending + round2Pending;

    return { totalStudents, pendingStudents, round1Pending, round2Pending };
  }, [targetTopics, targetStage]);

  // Dynamic Variable Insertion
  const handleInsertPlaceholder = (placeholder: string) => {
    setMessageText((prev) => `${prev} ${placeholder}`);
  };

  const handleLoadRound1Preset = () => {
    setTargetStage('round1');
    setMessageText(t('round1Template'));
  };

  const handleLoadRound2Preset = () => {
    setTargetStage('round2');
    setMessageText(t('round2Template'));
    setIncludeOptOutButton(true);
  };

  // Preview buttons including opt-out button if round 2
  const previewInlineButtons = useMemo(() => {
    if (targetStage === 'round2' && includeOptOutButton) {
      return [
        ...inlineButtons,
        [
          {
            id: 'btn-opt-out-preview',
            text: '🚫 با این استاد کلاس نداشتم',
            url: '#',
          },
        ],
      ];
    }
    return inlineButtons;
  }, [inlineButtons, targetStage, includeOptOutButton]);

  // Campaign Send Mutation
  const { mutateAsync: sendMutate, isPending: isSending } = useMutation({
    mutationFn: () => {
      const limitNum = recipientLimit.trim() ? parseInt(recipientLimit.trim(), 10) : undefined;
      return clientInquiriesServices.sendCampaign({
        topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
        targetStage,
        includeOptOutButton: targetStage === 'round2' ? includeOptOutButton : undefined,
        limitOnePerUser,
        messageText: messageText.trim(),
        inlineButtons,
        parseMode,
        recipientLimitPerTopic: limitNum && !isNaN(limitNum) && limitNum > 0 ? limitNum : undefined,
      });
    },
    onSuccess: (res) => {
      toast.success(tInquiries('toast.sentSuccess', { count: res.sentCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.lists });
      router.push('/dashboard/inquiries');
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim()) {
      toast.danger('متن پیام تلگرام نمی‌تواند خالی باشد.');
      return;
    }
    await sendMutate();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar with Back Button & Submit Action */}
      <div className="bg-surface flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-2xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={() => router.push('/dashboard/inquiries')}
            aria-label={t('back')}
          >
            <ArrowRight className={ICON_SIZE_CLASS.md} />
          </Button>

          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t('title')}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onPress={() => router.push('/dashboard/inquiries')}
            isDisabled={isSending}
          >
            {tCommon('actions.cancel')}
          </Button>

          <Button
            variant="primary"
            className="gap-2 font-bold px-6 shadow-md"
            onPress={() => void handleSend()}
            isPending={isSending}
            isDisabled={isSending || !messageText.trim()}
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? t('sendingAction') : t('sendAction')}</span>
          </Button>
        </div>
      </div>

      {/* 2. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Settings (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Target Audience Summary Card */}
          <Card className="p-5 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>{t('audienceCardTitle')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">
                  {t('topicsCount', { count: targetTopics.length })}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-primary-600 font-bold">
                  {t('pendingCount', { count: targetStats.pendingStudents })}
                </span>
              </div>
            </div>

            {/* Selected Topic Badges */}
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {isLoadingTopics ? (
                <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
                  <Spinner size="sm" />
                  <span>در حال بارگذاری سرگروه‌ها...</span>
                </div>
              ) : targetTopics.length === 0 ? (
                <p className="text-xs text-neutral-400 italic p-1">
                  تمام سرگروه‌ها و دانشجویان در انتظار انتخاب شده‌اند.
                </p>
              ) : (
                targetTopics.map((topic) => {
                  const pendingCount =
                    targetStage === 'round1'
                      ? (topic.round1PendingCount ?? topic.pendingInquiriesCount ?? 0)
                      : targetStage === 'round2'
                      ? (topic.round2PendingCount ?? 0)
                      : (topic.round1PendingCount ?? topic.pendingInquiriesCount ?? 0) + (topic.round2PendingCount ?? 0);
                  return (
                    <Chip
                      key={topic.id}
                      size="sm"
                      variant="secondary"
                      className="gap-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                    >
                      {topic.topicType === 'professor' ? (
                        <GraduationCap className="w-3 h-3 text-primary-500" />
                      ) : (
                        <BookOpen className="w-3 h-3 text-secondary-500" />
                      )}
                      <span className="font-semibold">{topic.canonicalName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ({pendingCount} نفر)
                      </span>
                    </Chip>
                  );
                })
              )}
            </div>
          </Card>

          {/* Target Stage Selector Card */}
          <Card className="p-4 border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                <Layers className="w-4 h-4 text-primary-500" />
                <span>{t('stageSelectorTitle')}</span>
              </div>
              <div className="text-[11px] font-semibold text-primary-600">
                {targetStage === 'round1'
                  ? `${targetStats.round1Pending} نفر واجد ارسال مرحله ۱`
                  : targetStage === 'round2'
                  ? `${targetStats.round2Pending} نفر واجد یادآوری مرحله ۲`
                  : `${targetStats.pendingStudents} نفر کل واجدین`}
              </div>
            </div>

            {/* Stage Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={targetStage === 'all' ? 'primary' : 'outline'}
                className="text-xs justify-between"
                onPress={() => setTargetStage('all')}
              >
                <span>{t('stageAll')}</span>
                <span className="font-mono text-[10px] opacity-80">
                  {targetStats.pendingStudents}
                </span>
              </Button>

              <Button
                size="sm"
                variant={targetStage === 'round1' ? 'primary' : 'outline'}
                className="text-xs justify-between"
                onPress={handleLoadRound1Preset}
              >
                <span>{t('stageRound1')}</span>
                <span className="font-mono text-[10px] opacity-80">
                  {targetStats.round1Pending}
                </span>
              </Button>

              <Button
                size="sm"
                variant={targetStage === 'round2' ? 'primary' : 'outline'}
                className="text-xs justify-between"
                onPress={handleLoadRound2Preset}
              >
                <span>{t('stageRound2')}</span>
                <span className="font-mono text-[10px] opacity-80">
                  {targetStats.round2Pending}
                </span>
              </Button>
            </div>

            <p className="text-[11px] text-neutral-500">
              {targetStage === 'round1'
                ? t('round1Desc')
                : targetStage === 'round2'
                ? t('round2Desc')
                : 'پیام برای تمام دانشجویانی که تاکنون تبدیل به ثبت نظر نشده‌اند (حداکثر ۲ بار پیگیری) ارسال می‌شود.'}
            </p>

            {/* Round 2 Opt-out button toggle */}
            {targetStage === 'round2' && (
              <div className="mt-1 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-start gap-2.5 bg-neutral-50 dark:bg-neutral-800/40 p-2.5 rounded-xl">
                <input
                  type="checkbox"
                  id="includeOptOut"
                  checked={includeOptOutButton}
                  onChange={(e) => setIncludeOptOutButton(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="includeOptOut" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                    {t('includeOptOutButton')}
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {t('includeOptOutButtonDesc')}
                  </span>
                </label>
              </div>
            )}

            {/* Anti-spam deduplication toggle */}
            <div className="mt-1 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-start gap-2.5 bg-neutral-50 dark:bg-neutral-800/40 p-2.5 rounded-xl">
              <input
                type="checkbox"
                id="limitOnePerUser"
                checked={limitOnePerUser}
                onChange={(e) => setLimitOnePerUser(e.target.checked)}
                className="mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <label htmlFor="limitOnePerUser" className="text-xs cursor-pointer select-none">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {t('limitOnePerUser')}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  {t('limitOnePerUserDesc')}
                </span>
              </label>
            </div>
          </Card>

          {/* Preset Templates Quick Loader */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">
              {t('presetTemplatesTitle')}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-white dark:bg-neutral-800"
              onPress={handleLoadRound1Preset}
            >
              {t('loadRound1Preset')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
              onPress={handleLoadRound2Preset}
            >
              {t('loadRound2Preset')}
            </Button>
          </div>

          {/* Dynamic Placeholders Picker */}
          <Card className="p-4 border border-primary-200/60 dark:border-primary-950/60 bg-primary-50/30 dark:bg-primary-950/10 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>{t('variablesTitle')}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-white dark:bg-neutral-800 border-primary-200 dark:border-neutral-700 text-primary-700 dark:text-primary-300 font-mono hover:bg-primary-50"
                onPress={() => handleInsertPlaceholder('{نام_دانشجو}')}
              >
                {'{نام_دانشجو}'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-white dark:bg-neutral-800 border-primary-200 dark:border-neutral-700 text-primary-700 dark:text-primary-300 font-mono hover:bg-primary-50"
                onPress={() => handleInsertPlaceholder('{نام_استاد}')}
              >
                {'{نام_استاد}'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-white dark:bg-neutral-800 border-primary-200 dark:border-neutral-700 text-primary-700 dark:text-primary-300 font-mono hover:bg-primary-50"
                onPress={() => handleInsertPlaceholder('{نام_درس}')}
              >
                {'{نام_درس}'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-mono hover:bg-amber-100 flex items-center gap-1"
                onPress={() => handleInsertPlaceholder('{deep_link}')}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{'{deep_link}'}</span>
              </Button>
            </div>
          </Card>

          {/* Telegram Rich Editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {t('messageLabel')}
            </label>
            <TelegramEditor
              value={messageText}
              onChange={setMessageText}
              disabled={isSending}
              placeholder={t('defaultMessage')}
            />
          </div>

          {/* Inline Keyboard Builder */}
          <div className="flex flex-col gap-1.5">
            <InlineKeyboardBuilder
              rows={inlineButtons}
              onChange={setInlineButtons}
              disabled={isSending}
            />
          </div>

          {/* Optional Recipient Limit */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <InputField
              label={t('recipientLimitLabel')}
              placeholder={t('recipientLimitPlaceholder')}
              type="number"
              min={1}
              value={recipientLimit}
              onChange={(e) => setRecipientLimit(e.target.value)}
              helperText={tModals('recipientLimitHint')}
              disabled={isSending}
            />
          </div>
        </div>

        {/* Right Column: Sticky Authentic Telegram Phone Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 flex flex-col items-center">
          <TelegramLivePreview
            messageText={messageText}
            inlineButtons={previewInlineButtons}
            samplePlaceholders={{
              '{نام_دانشجو}': 'علی رضایی',
              '{نام_استاد}': targetTopics[0]?.canonicalName || 'دکتر مسعود حسنی',
              '{نام_درس}': targetTopics[0]?.course?.name || 'ریاضی عمومی ۱',
              '{deep_link}': 'https://t.me/uni_assistant_bot?start=inq_rev_sample',
            }}
          />
        </div>
      </div>
    </div>
  );
};
