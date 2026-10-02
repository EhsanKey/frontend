'use client';

import { Button, Modal } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface ReviewDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export const ReviewDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: ReviewDeleteModalProps) => {
  const t = useTranslations('reviews');
  const tCommon = useTranslations('common');

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="text-danger-600">
                {t('modals.deleteTitle')}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                {t('modals.deleteConfirm')}
              </p>
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-2">
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {tCommon('actions.cancel')}
              </Button>
              <Button
                variant="danger"
                isPending={isPending}
                onPress={handleConfirm}
              >
                {tCommon('actions.delete')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
