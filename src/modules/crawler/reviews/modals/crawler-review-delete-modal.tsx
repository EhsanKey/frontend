'use client';

import { Button, Modal } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import type { CrawlerMessageDto } from '@/apis/services/crawler';

interface CrawlerReviewDeleteModalProps {
  message: CrawlerMessageDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (messageId: string) => Promise<void>;
  isPending?: boolean;
}

export const CrawlerReviewDeleteModal = ({
  message,
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: CrawlerReviewDeleteModalProps) => {
  const t = useTranslations('crawler.reviews.table');
  const tCommon = useTranslations('common');

  if (!message) return null;

  const handleConfirm = async () => {
    await onConfirm(message.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-danger-600">
                <Trash2 className={ICON_SIZE_CLASS.md} />
                <Modal.Heading className="text-danger-600 font-bold">
                  {t('deleteSingleTitle')}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-3">
              <p className="text-body-sm text-neutral-600 leading-relaxed font-normal">
                {t('deleteSingleConfirm')}
              </p>

              <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-caption text-neutral-700 line-clamp-3">
                {message.content}
              </div>
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
                <span>{t('confirmDelete')}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
