'use client';

import { Button, Modal } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface ItemDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemTitle?: string;
  isPending?: boolean;
}

export const ItemDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  isPending = false,
}: ItemDeleteModalProps) => {
  const t = useTranslations('items.modal');
  const tCommon = useTranslations('common.actions');

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
              <Modal.Heading>{t('deleteTitle')}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="space-y-2">
              <p className="text-body-sm text-neutral-600">
                {t('deleteConfirm')}
              </p>
              {itemTitle && (
                <p className="bg-neutral-100 rounded-md p-2.5 text-body-sm font-semibold text-neutral-900">
                  {itemTitle}
                </p>
              )}
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-2">
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {tCommon('cancel')}
              </Button>
              <Button
                variant="danger"
                isPending={isPending}
                onPress={handleConfirm}
              >
                {tCommon('delete')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ItemDeleteModal;
