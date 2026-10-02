'use client';

import { Button, Modal } from '@heroui/react';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';

interface CacheFlushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlush: () => Promise<void>;
  isPending?: boolean;
}

export const CacheFlushModal = ({
  isOpen,
  onClose,
  onFlush,
  isPending = false,
}: CacheFlushModalProps) => {
  const t = useTranslations('cache.flushModal');

  const handleConfirm = async () => {
    await onFlush();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`text-danger-600 ${ICON_SIZE_CLASS.md}`} />
                <Modal.Heading>{t('title')}</Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body>
              <p className="text-body-sm leading-relaxed text-neutral-600">
                {t('description')}
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {t('cancel')}
              </Button>
              <Button
                variant="danger"
                onPress={handleConfirm}
                isPending={isPending}
              >
                {t('confirm')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
