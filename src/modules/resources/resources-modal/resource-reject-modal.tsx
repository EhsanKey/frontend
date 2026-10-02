'use client';

import { Button, Modal } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { IResourceSubmission } from '@/models';
import { InputField } from '@/components/shared';

interface ResourceRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  resource: IResourceSubmission | null;
  isPending?: boolean;
}

interface FormValues {
  reason: string;
}

export const ResourceRejectModal = ({
  isOpen,
  onClose,
  onSubmit,
  resource,
  isPending = false,
}: ResourceRejectModalProps) => {
  const t = useTranslations('resources');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { reason: '' },
  });

  useEffect(() => {
    reset({ reason: '' });
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit(data.reason);
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
                {t('modals.rejectTitle')}
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <p className="text-body-sm text-neutral-600 leading-relaxed">
                  {t('modals.rejectConfirmPrompt', { title: resource?.title || '' })}
                </p>

                <InputField
                  label={t('modals.rejectReason')}
                  registration={register('reason', { required: t('edit.validation.rejectReasonRequired') })}
                  error={errors.reason?.message}
                  placeholder={t('modals.rejectReasonPlaceholder')}
                  isDisabled={isPending}
                />
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  isPending={isPending}
                >
                  {t('actions.reject')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
