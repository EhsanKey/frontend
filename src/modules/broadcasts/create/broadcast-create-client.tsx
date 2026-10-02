'use client';

import {
  Button,
  toast,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Radio,
  Send,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { clientBroadcastsServices } from '@/apis/services/broadcasts/client';
import type {
  BroadcastTargetFiltersDto,
  CreateBroadcastDto,
  InlineKeyboardRowDto,
} from '@/apis/services/broadcasts';
import {
  InputField,
  InlineKeyboardBuilder,
  TelegramEditor,
  TelegramLivePreview,
} from '@/components/shared';
import { QUERY_KEYS } from '@/constants';
import { usePostRequest } from '@/hooks';
import { AudienceFilterCard } from '../components/audience-filter-card';

import {
  createBroadcastCreateSchema,
  type BroadcastCreateFormValues,
} from './broadcast-create.schema';

export const BroadcastCreateClient: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('broadcasts');
  const tValidation = useTranslations('broadcasts.validation');
  const tCommon = useTranslations('common');
  const [audienceCount, setAudienceCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BroadcastCreateFormValues>({
    resolver: zodResolver(
      createBroadcastCreateSchema({
        buttonText: tValidation('buttonText'),
        buttonUrl: tValidation('buttonUrl'),
        titleMin: tValidation('titleMin'),
        titleMax: tValidation('titleMax'),
        messageMin: tValidation('messageMin'),
      })
    ),
    defaultValues: {
      title: '',
      messageText: t('create.defaultTemplate'),
      parseMode: 'HTML',
      inlineButtons: [
        [
          {
            id: 'btn-init-1',
            text: t('create.defaultButton'),
            url: 'https://t.me/uni_assistant_bot',
          },
        ],
      ],
      targetFilters: {
        targetType: 'all',
      },
    },
  });

  const messageText = watch('messageText');
  const inlineButtons = watch('inlineButtons');
  const targetFilters = watch('targetFilters');

  const { mutateAsync: createBroadcastMutate, isPending } = usePostRequest({
    requestFn: (data: CreateBroadcastDto) =>
      clientBroadcastsServices.createBroadcast(data),
    onSuccess: () => {
      toast.success(t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.lists() });
      router.push('/dashboard/broadcasts');
    },
  });

  const onSubmit = async (values: BroadcastCreateFormValues) => {
    await createBroadcastMutate({
      title: values.title.trim(),
      messageText: values.messageText.trim(),
      parseMode: values.parseMode,
      inlineButtons: values.inlineButtons,
      targetFilters: values.targetFilters,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-2xs">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t('create.headerTitle')}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t('create.headerSubtitle')}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onPress={() => router.push('/dashboard/broadcasts')}
          isDisabled={isPending}
        >
          <ArrowRight className="h-4 w-4" />
          <span>{tCommon('actions.back')}</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Campaign Title Card */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <InputField
            label={t('create.subjectLabel')}
            placeholder={t('create.subjectPlaceholder')}
            registration={register('title')}
            error={errors.title?.message}
            required
            isDisabled={isPending}
          />
        </div>

        {/* Audience Targeting Card */}
        <AudienceFilterCard
          filters={targetFilters}
          onChange={(newFilters: BroadcastTargetFiltersDto) =>
            setValue('targetFilters', newFilters)
          }
          onAudienceCountChange={setAudienceCount}
        />

        {/* Grid: Editor + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main: Telegram Editor & Inline Keyboard Builder */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                <span>{t('editor.htmlNotice')}</span>
                <span className="text-[11px] text-neutral-500 font-normal">
                  {t('editor.supportedTags')}
                </span>
              </label>
              <Controller
                name="messageText"
                control={control}
                render={({ field }) => (
                  <TelegramEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.messageText?.message}
                  />
                )}
              />
            </div>

            <InlineKeyboardBuilder
              rows={inlineButtons}
              onChange={(newButtons: InlineKeyboardRowDto[]) =>
                setValue('inlineButtons', newButtons)
              }
            />
          </div>

          {/* Right: Live Simulated Telegram App Preview */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
                  {t('preview.title')}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {t('preview.simulator')}
                </span>
              </div>
              <TelegramLivePreview
                messageText={messageText}
                inlineButtons={inlineButtons}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center justify-between shadow-xs">
          <Button
            variant="outline"
            onPress={() => router.push('/dashboard/broadcasts')}
            isDisabled={isPending}
          >
            {tCommon('actions.cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="gap-2 px-8"
            isPending={isPending}
          >
            <Send className="w-4 h-4" />
            <span>{t('create.confirmSubmit', { count: audienceCount.toLocaleString('fa-IR') })}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BroadcastCreateClient;
