'use client';

import {
  Button,
  Modal,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/shared';
import type {
  CreateMajorDto,
  UpdateMajorDto,
} from '@/apis/services/majors/_dto';
import type { IMajor } from '@/models';

interface MajorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateMajorDto | UpdateMajorDto) => Promise<void>;
  major: IMajor | null;
  isPending?: boolean;
}

interface FormValues {
  name: string;
}

export const MajorFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  major,
  isPending = false,
}: MajorFormModalProps) => {
  const t = useTranslations('majors');
  const tCommon = useTranslations('common');
  const isEdit = Boolean(major);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (major) {
      reset({
        name: major.name,
      });
    } else {
      reset({
        name: '',
      });
    }
  }, [major, reset, isOpen]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {isEdit ? t('modals.editTitle') : t('modals.createTitle')}
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <InputField
                  label={t('fields.name')}
                  placeholder={t('fields.namePlaceholder')}
                  errorMessage={errors.name?.message}
                  isInvalid={Boolean(errors.name)}
                  isDisabled={isPending}
                  {...register('name', { required: t('validation.nameRequired') })}
                />
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button variant="primary" type="submit" isPending={isPending}>
                  {tCommon('actions.save')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
