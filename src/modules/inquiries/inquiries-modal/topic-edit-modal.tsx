'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  toast,
} from '@heroui/react';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientInquiriesServices } from '@/apis/services/inquiries';
import { InputField, SelectProfessor } from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import type { IInquiryTopic, InquiryTopicStatus } from '@/models';

interface TopicEditModalProps {
  topic: IInquiryTopic | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TopicEditModal: React.FC<TopicEditModalProps> = ({
  topic,
  isOpen,
  onClose,
}) => {
  const t = useTranslations('inquiries.modals');
  const tInquiries = useTranslations('inquiries');
  const tStatus = useTranslations('inquiries.status');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const [canonicalName, setCanonicalName] = useState('');
  const [professorId, setProfessorId] = useState<string | null>(null);
  const [status, setStatus] = useState<InquiryTopicStatus>('active');

  useEffect(() => {
    if (topic) {
      setCanonicalName(topic.canonicalName);
      setProfessorId(topic.professor?.id ?? null);
      setStatus(topic.status);
    }
  }, [topic]);

  const { mutateAsync: updateMutate, isPending } = useMutation({
    mutationFn: () =>
      clientInquiriesServices.updateTopic(topic!.id, {
        canonicalName: canonicalName.trim() || undefined,
        professorId,
        status,
      }),
    onSuccess: () => {
      toast.success(tInquiries('toast.updated'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
      onClose();
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  if (!topic) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutate();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <Edit className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>{t('editTopicTitle')}</Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-4">
                <InputField
                  label={t('canonicalNameLabel')}
                  value={canonicalName}
                  onChange={(e) => setCanonicalName(e.target.value)}
                  required
                  isDisabled={isPending}
                />

                <div className="flex flex-col gap-1.5">
                  <SelectProfessor
                    label={t('linkProfessorLabel')}
                    value={professorId}
                    onChange={(val) => setProfessorId(val || null)}
                    isDisabled={isPending}
                    isClearable
                  />
                  <p className="text-[11px] text-neutral-400">
                    {t('linkProfessorDesc')}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t('statusLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    {(['active', 'resolved', 'archived'] as InquiryTopicStatus[]).map((st) => (
                      <Button
                        key={st}
                        type="button"
                        size="sm"
                        variant={status === st ? 'primary' : 'outline'}
                        className="flex-1 text-xs"
                        onPress={() => setStatus(st)}
                        isDisabled={isPending}
                      >
                        {tStatus(st)}
                      </Button>
                    ))}
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button type="submit" variant="primary" isPending={isPending}>
                  {tCommon('actions.save')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
