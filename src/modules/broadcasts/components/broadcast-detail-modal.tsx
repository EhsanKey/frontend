'use client';

import React from 'react';
import {
  Button,
  Chip,
  Modal,
  Spinner,
  toast,
} from '@heroui/react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  Send,
  Calendar,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { clientBroadcastsServices } from '@/apis/services/broadcasts';
import { TelegramLivePreview } from '@/components/shared';
import { QUERY_KEYS } from '@/constants';
import { formatPersianDate } from '@/utils';
import type { IBroadcastCampaign } from '@/models';

interface BroadcastDetailModalProps {
  campaign: IBroadcastCampaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastDetailModal: React.FC<BroadcastDetailModalProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const {
    data: detailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.broadcasts.detail(campaign?.id || ''),
    queryFn: () => clientBroadcastsServices.getBroadcastDetails(campaign?.id || ''),
    enabled: Boolean(campaign?.id && isOpen),
    refetchInterval: campaign?.status === 'sending' ? 3000 : false,
  });

  const retryMutation = useMutation({
    mutationFn: () => clientBroadcastsServices.retryFailedBroadcast(campaign?.id || ''),
    onSuccess: (res) => {
      toast.success(t('toast.retryStarted', { count: res.retryingCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.detail(campaign?.id || '') });
      refetch();
    },
    onError: (err: unknown) => {
      toast.danger((err as Error)?.message || t('toast.retryError'));
    },
  });

  if (!campaign) return null;

  const activeCamp = detailData?.campaign || campaign;
  const recipients = detailData?.recipients?.items || [];

  const successPercent = activeCamp.totalTargets > 0
    ? Math.round((activeCamp.successfulCount / activeCamp.totalTargets) * 100)
    : 0;

  const failedPercent = activeCamp.totalTargets > 0
    ? Math.round((activeCamp.failedCount / activeCamp.totalTargets) * 100)
    : 0;

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700">
            {t('statuses.completed')}
          </Chip>
        );
      case 'sending':
        return (
          <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700">
            {t('statuses.sending')}
          </Chip>
        );
      case 'partially_failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700">
            {t('statuses.partially_failed')}
          </Chip>
        );
      case 'failed':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700">
            {t('statuses.failed')}
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-default-100 text-default-700">
            {t('statuses.draft')}
          </Chip>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="cover" className="max-w-5xl w-full p-2 sm:p-4 my-auto">
          <Modal.Dialog className="max-h-[90vh] flex flex-col">
            <Modal.CloseTrigger />
            <Modal.Header className="border-b border-divider pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3 w-full pr-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-base">
                  <Send className="w-5 h-5 text-primary" />
                  <span>{activeCamp.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusChip(activeCamp.status)}
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
              {/* Delivery Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-divider bg-default-50/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-default-500 font-medium">{t('detailModal.totalAudience')}</span>
                    <span className="text-lg font-bold text-foreground">
                      {activeCamp.totalTargets.toLocaleString('fa-IR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-success-200 bg-success-50/30">
                  <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center text-success-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-success-700 font-medium">{t('detailModal.successful')}</span>
                    <span className="text-lg font-bold text-success-700">
                      {activeCamp.successfulCount.toLocaleString('fa-IR')} ({successPercent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-danger-200 bg-danger-50/30">
                  <div className="w-10 h-10 rounded-lg bg-danger-100 flex items-center justify-center text-danger-600">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-danger-700 font-medium">{t('detailModal.failed')}</span>
                    <span className="text-lg font-bold text-danger-700">
                      {activeCamp.failedCount.toLocaleString('fa-IR')} ({failedPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-default-500">
                  <span>{t('detailModal.progress')}</span>
                  <span>{t('detailModal.successPercent', { percent: successPercent })}</span>
                </div>
                <div className="w-full h-2.5 bg-default-200 rounded-full overflow-hidden flex">
                  <div
                    className="bg-success-500 h-full transition-all duration-500"
                    style={{ width: `${successPercent}%` }}
                  />
                  <div
                    className="bg-danger-500 h-full transition-all duration-500"
                    style={{ width: `${failedPercent}%` }}
                  />
                </div>
              </div>

              {/* Retry Action Banner when there are failures */}
              {activeCamp.failedCount > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-warning-200 bg-warning-50/60 dark:bg-warning-950/20">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-warning-800 dark:text-warning-300">
                      {t('detailModal.retryFailedTitle', { count: activeCamp.failedCount.toLocaleString('fa-IR') })}
                    </span>
                    <span className="text-xs text-warning-700 dark:text-warning-400">
                      {t('detailModal.retryFailedDesc')}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 shrink-0 bg-warning-600 hover:bg-warning-700 text-white"
                    isPending={retryMutation.isPending}
                    isDisabled={retryMutation.isPending}
                    onPress={() => retryMutation.mutate()}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('detailModal.retryFailedAction')}</span>
                  </Button>
                </div>
              )}

              {/* Preview and Recipients list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recipients Table */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">
                      {t('detailModal.recipientsTitle')}
                    </h4>
                    <span className="text-xs text-default-400">
                      {t('detailModal.recipientsCount', { count: recipients.length })}
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Spinner size="md" />
                    </div>
                  ) : recipients.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-divider rounded-xl text-xs text-default-400">
                      {t('detailModal.noRecipients')}
                    </div>
                  ) : (
                    <div className="border border-divider rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead className="bg-default-50 border-b border-divider text-default-600 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3">{t('detailModal.userCol')}</th>
                            <th className="py-2.5 px-3">{t('detailModal.statusCol')}</th>
                            <th className="py-2.5 px-3">{t('detailModal.errorCol')}</th>
                            <th className="py-2.5 px-3">{t('detailModal.attemptsCol')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider/60">
                          {recipients.map((rec) => (
                            <tr key={rec.id} className="hover:bg-default-50/40">
                              <td className="py-2.5 px-3">
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">
                                    {rec.userFirstName || t('detailModal.telegramUserFallback')} {rec.userLastName || ''}
                                  </span>
                                  {rec.userUsername && (
                                    <span className="text-[10px] text-default-400" dir="ltr">
                                      @{rec.userUsername}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                {rec.status === 'sent' ? (
                                  <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 text-[10px]">
                                    {t('detailModal.statusSent')}
                                  </Chip>
                                ) : rec.status === 'failed' ? (
                                  <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 text-[10px]">
                                    {t('detailModal.statusFailed')}
                                  </Chip>
                                ) : (
                                  <Chip size="sm" variant="secondary" className="bg-default-100 text-default-600 text-[10px]">
                                    {t('detailModal.statusQueued')}
                                  </Chip>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-default-500">
                                {rec.errorMessage || '—'}
                              </td>
                              <td className="py-2.5 px-3 text-default-500">
                                {rec.retryCount > 0 ? t('detailModal.attemptTimes', { count: rec.retryCount }) : t('detailModal.firstAttempt')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Message Live Preview */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {t('detailModal.messagePreview')}
                  </h4>
                  <TelegramLivePreview
                    messageText={activeCamp.messageText}
                    inlineButtons={activeCamp.inlineButtons || []}
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-t border-divider pt-3 pb-2 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-default-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {t('detailModal.createdAt', { date: formatPersianDate(activeCamp.createdAt) })}
                </span>
              </div>

              <Button variant="ghost" size="md" onPress={onClose}>
                {tCommon('actions.close')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
