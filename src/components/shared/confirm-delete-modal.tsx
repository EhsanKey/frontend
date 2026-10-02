'use client';

import { Button, Modal } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: ReactNode;
  /** Optional highlighted entity name / cache key shown inside the modal body. */
  entityLabel?: ReactNode;
  extraContent?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Standard destructive confirmation dialog.
 *
 * Replaces the eleven near-identical `*-delete-modal.tsx` files that only differed by
 * their translation namespace.
 */
export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  entityLabel,
  extraContent,
  confirmLabel,
  cancelLabel,
  isPending = false,
  size = 'sm',
  className,
}: ConfirmDeleteModalProps) => {
  const tCommon = useTranslations('common');

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size={size}>
          <Modal.Dialog className={className}>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-danger-600">
                <Trash2 className={ICON_SIZE_CLASS.md} />
                <Modal.Heading className="text-danger-600 font-bold">
                  {title}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-3">
              {description ? (
                <p className="text-body-sm text-neutral-600 leading-relaxed font-normal">
                  {description}
                </p>
              ) : null}

              {entityLabel ? (
                <p className="rounded-lg bg-neutral-100 p-2.5 text-body-sm font-semibold text-neutral-900 break-words">
                  {entityLabel}
                </p>
              ) : null}

              {extraContent}
            </Modal.Body>

            <Modal.Footer className={cn('flex justify-end gap-2 pt-2')}>
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {cancelLabel ?? tCommon('actions.cancel')}
              </Button>
              <Button
                variant="danger"
                isPending={isPending}
                onPress={handleConfirm}
                className="gap-1.5"
              >
                <Trash2 className={ICON_SIZE_CLASS.sm} />
                <span>{confirmLabel ?? tCommon('actions.delete')}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ConfirmDeleteModal;
