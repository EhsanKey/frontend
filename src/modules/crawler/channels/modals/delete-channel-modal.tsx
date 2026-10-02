'use client';

import { Button, Modal } from '@heroui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import type { TrackedChannelDto } from '@/apis/services/crawler';

interface DeleteChannelModalProps {
  channel: TrackedChannelDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (channelId: string, deleteMessages: boolean) => Promise<void>;
  isPending?: boolean;
}

export const DeleteChannelModal = ({
  channel,
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: DeleteChannelModalProps) => {
  const t = useTranslations('crawler.channels');
  const tCommon = useTranslations('common');
  const [deleteMessages, setDeleteMessages] = useState(false);

  // Reset deleteMessages checkbox when opening modal for a new channel
  useEffect(() => {
    if (isOpen) {
      setDeleteMessages(false);
    }
  }, [isOpen, channel?.id]);

  if (!channel) return null;

  const handleConfirm = async () => {
    await onConfirm(channel.id, deleteMessages);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-danger-600">
                <Trash2 className={ICON_SIZE_CLASS.md} />
                <Modal.Heading className="text-danger-600 font-bold">
                  {t('table.deleteModalTitle')}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-4">
              <p className="text-body-sm text-neutral-700 leading-relaxed font-normal">
                {t('table.deleteModalDesc', { title: channel.title })}
              </p>

              {/* Delete messages selection checkbox card */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 transition-colors hover:border-neutral-300">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deleteMessages}
                    onChange={(e) => setDeleteMessages(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-danger-600 focus:ring-danger-500 cursor-pointer"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-body-sm font-semibold text-neutral-900">
                      {t('table.deleteMessagesCheckbox')}
                    </span>
                    <span className="text-caption text-neutral-500 leading-normal font-normal">
                      {t('table.deleteMessagesHint')}
                    </span>
                  </div>
                </label>
              </div>

              {deleteMessages && (
                <div className="flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-caption text-danger-700 border border-danger-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600" />
                  <span>
                    توجه: پیام‌ها و نظرات این کانال ({(channel.totalMessagesCollected || 0).toLocaleString('fa-IR')} پیام) نیز به طور کامل پاک خواهند شد.
                  </span>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {tCommon('actions.cancel')}
              </Button>
              <Button
                variant="danger"
                isPending={isPending}
                onPress={handleConfirm}
                className="gap-1.5"
              >
                <Trash2 className={ICON_SIZE_CLASS.sm} />
                <span>{t('table.confirmDelete')}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
