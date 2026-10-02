'use client';

import { Button, Modal } from '@heroui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';

interface CrawlerReviewBulkDeleteModalProps {
  selectedCount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export const CrawlerReviewBulkDeleteModal = ({
  selectedCount,
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: CrawlerReviewBulkDeleteModalProps) => {
  const t = useTranslations('crawler.reviews.table');
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
              <div className="flex items-center gap-2 text-danger-600">
                <Trash2 className={ICON_SIZE_CLASS.md} />
                <Modal.Heading className="text-danger-600 font-bold">
                  {t('bulkDeleteTitle')}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-lg bg-danger-50 p-3 text-caption text-danger-700 border border-danger-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600 mt-0.5" />
                <p className="leading-relaxed font-normal">
                  {t('bulkDeleteConfirm', { count: selectedCount.toLocaleString('fa-IR') })}
                </p>
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
