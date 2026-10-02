'use client';

import { Button, Modal } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import type { IAiCacheEntry } from '@/models';

interface CacheDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: IAiCacheEntry | null;
  onDelete: (id: string) => Promise<void>;
  isPending?: boolean;
}

export const CacheDeleteModal = ({
  isOpen,
  onClose,
  entry,
  onDelete,
  isPending = false,
}: CacheDeleteModalProps) => {
  const t = useTranslations('cache.deleteModal');

  if (!entry) return null;

  const handleConfirm = async () => {
    await onDelete(entry.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Trash2 className={`text-danger-600 ${ICON_SIZE_CLASS.md}`} />
                <Modal.Heading>{t('title')}</Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-3">
              <p className="text-body-sm text-neutral-600">
                {t('description')}
              </p>
              <div className="rounded-lg bg-neutral-100 p-2 font-mono text-caption text-neutral-700 break-all" dir="ltr">
                {entry.cacheKey}
              </div>
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
