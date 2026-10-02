'use client';

import { Button, Modal } from '@heroui/react';
import { useTranslations } from 'next-intl';
import type { FormEventHandler, ReactNode } from 'react';
import { cn } from '@/utils';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  title: ReactNode;
  children: ReactNode;
  isPending?: boolean;
  isSubmitDisabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | 'cover';
  maxWidthClassName?: string;
  /** Renders the footer inside a scrollable body for long forms. */
  isScrollable?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  headerContent?: ReactNode;
  className?: string;
}

/**
 * Standard create/edit modal shell: header, `<form>` wrapper, body slot and the
 * cancel/submit footer. Every entity form modal reuses it so layout, focus and
 * pending states can never drift apart between modules.
 */
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  isPending = false,
  isSubmitDisabled = false,
  size = 'md',
  maxWidthClassName,
  isScrollable = false,
  submitLabel,
  cancelLabel,
  headerContent,
  className,
}: FormModalProps) => {
  const tCommon = useTranslations('common');

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size={size} className={maxWidthClassName}>
          <Modal.Dialog
            className={cn(
              isScrollable &&
                'max-h-[90vh] flex flex-col overflow-hidden w-full',
              className,
            )}
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              {headerContent ?? <Modal.Heading>{title}</Modal.Heading>}
            </Modal.Header>

            <form
              onSubmit={onSubmit}
              className={cn(
                'contents',
                isScrollable && 'flex flex-1 flex-col overflow-hidden',
              )}
            >
              <Modal.Body
                className={cn(
                  'flex flex-col gap-4',
                  isScrollable && 'overflow-y-auto',
                )}
              >
                {children}
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {cancelLabel ?? tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                  isDisabled={isSubmitDisabled}
                >
                  {submitLabel ?? tCommon('actions.save')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default FormModal;
