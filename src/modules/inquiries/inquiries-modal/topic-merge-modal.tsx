'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  ListBox,
  Modal,
  Select,
  Spinner,
  toast,
} from '@heroui/react';
import { GitMerge, Users, Layers, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientInquiriesServices } from '@/apis/services/inquiries';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import type { IInquiryTopic } from '@/models';

interface TopicMergeModalProps {
  topic: IInquiryTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TopicMergeModal: React.FC<TopicMergeModalProps> = ({
  topic,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations('inquiries.modals');
  const tInquiries = useTranslations('inquiries');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const [targetTopicId, setTargetTopicId] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setTargetTopicId('');
    }
  }, [isOpen]);

  // Fetch candidates of same topic type
  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: QUERY_KEYS.inquiries.topics({
      type: topic?.topicType,
      pageSize: 100,
    }),
    queryFn: () =>
      clientInquiriesServices.getTopics({
        type: topic?.topicType,
        pageSize: 100,
      }),
    enabled: isOpen && Boolean(topic),
  });

  const candidateTopics = (topicsData?.items || []).filter(
    (cand) => cand.id !== topic?.id,
  );

  const { mutateAsync: mergeMutate, isPending } = useMutation({
    mutationFn: () =>
      clientInquiriesServices.mergeTopics({
        sourceTopicId: topic!.id,
        targetTopicId,
      }),
    onSuccess: () => {
      toast.success(tInquiries('toast.mergeTopicSuccess'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.lists });
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      toast.danger(err instanceof Error ? err.message : tInquiries('toast.sentFail'));
    },
  });

  if (!topic) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTopicId || targetTopicId === 'none') return;
    await mergeMutate();
  };

  const selectedTargetTopic = candidateTopics.find((cand) => cand.id === targetTopicId);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-secondary-600">
                <GitMerge className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>
                  {t('mergeTopicTitle', { name: topic.canonicalName })}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-4">
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t('mergeTopicDesc')}
                </p>

                <div className="rounded-xl border border-secondary-100 bg-secondary-50/50 dark:border-secondary-900/40 dark:bg-secondary-950/20 p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-secondary-800 dark:text-secondary-300 leading-relaxed">
                    <span>
                      سرگروه مبدا دارای <strong>{topic.uniqueStudentsCount}</strong> دانشجو و{' '}
                      <strong>{topic.aliases?.length || 1}</strong> واریانت است. در صورت وجود کاربران یکسان بین دو سرگروه، سوابق به صورت خودکار ادغام و کاربران تکراری حذف خواهند شد.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t('selectTargetTopicToMerge')}
                  </label>

                  {isLoadingTopics ? (
                    <div className="flex items-center justify-center p-4">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <Select
                      selectedKey={targetTopicId}
                      onSelectionChange={(key) => setTargetTopicId(String(key))}
                      className="w-full"
                      aria-label={t('selectTargetTopicToMerge')}
                      isDisabled={isPending}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label={t('selectTargetTopicToMerge')}>
                          {candidateTopics.length === 0 ? (
                            <ListBox.Item id="none" textValue="هیچ سرگروه دیگری یافت نشد" isDisabled>
                              هیچ سرگروه دیگری یافت نشد
                            </ListBox.Item>
                          ) : (
                            candidateTopics.map((cand) => (
                              <ListBox.Item
                                key={cand.id}
                                id={cand.id}
                                textValue={`${cand.canonicalName} (${cand.uniqueStudentsCount} دانشجو)`}
                              >
                                <div className="flex items-center justify-between w-full py-1">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                                      {cand.canonicalName}
                                    </span>
                                    <span className="text-[10px] text-neutral-400">
                                      {cand.professor?.name ? `استاد: ${cand.professor.name}` : 'بدون نگاشت'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3 text-neutral-400" />
                                      {cand.uniqueStudentsCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Layers className="w-3 h-3 text-neutral-400" />
                                      {cand.aliases?.length || 0}
                                    </span>
                                  </div>
                                </div>
                              </ListBox.Item>
                            ))
                          )}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                </div>

                {selectedTargetTopic && (
                  <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    سرگروه مقصد انتخاب شده: <strong className="text-neutral-900 dark:text-neutral-100">{selectedTargetTopic.canonicalName}</strong>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={!targetTopicId || targetTopicId === 'none'}
                  isPending={isPending}
                >
                  {t('confirmMergeTopic')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
