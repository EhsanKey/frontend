'use client';

import {
  Button,
  Modal,
} from '@heroui/react';
import { BellRing, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { InputField } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';

interface TriggerNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customMessage?: string) => Promise<void>;
  recipientCount: number;
  isPending?: boolean;
}

export const TriggerNotificationModal = ({
  isOpen,
  onClose,
  onSubmit,
  recipientCount,
  isPending = false,
}: TriggerNotificationModalProps) => {
  const t = useTranslations('inquiries.modals');
  const tCommon = useTranslations('common');
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(customMessage.trim() || undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <BellRing className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>{t('triggerTitle')}</Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-4">
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
                  <p className="text-body-sm font-bold text-primary-900">
                    {t('recipientCount', { count: recipientCount })}
                  </p>
                  <p className="mt-1 text-caption text-primary-800 leading-relaxed">
                    {t('defaultNotice')}
                  </p>
                </div>

                <InputField
                  label={t('customMessageLabel')}
                  placeholder={t('customMessagePlaceholder')}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  isDisabled={isPending}
                />
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                >
                  <Send className={ICON_SIZE_CLASS.sm} />
                  {t('confirmButton')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
