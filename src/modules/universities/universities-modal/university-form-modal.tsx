'use client';

import { Button, Modal } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateUniversityDto, UpdateUniversityDto } from '@/apis/services/universities/_dto';
import type { IUniversity } from '@/models';
import { InputField } from '@/components/shared';

interface UniversityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateUniversityDto | UpdateUniversityDto) => Promise<void>;
  university: IUniversity | null;
  isPending?: boolean;
}

interface FormValues {
  name: string;
}

export const UniversityFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  university,
  isPending = false,
}: UniversityFormModalProps) => {
  const t = useTranslations('universities');
  const tCommon = useTranslations('common');
  const isEdit = Boolean(university);

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
    if (university) {
      reset({
        name: university.name,
      });
    } else {
      reset({
        name: '',
      });
    }
  }, [university, reset, isOpen]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-lg">
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
                  registration={register('name', { required: t('validation.nameRequired') })}
                  error={errors.name?.message}
                  placeholder={t('fields.namePlaceholder')}
                  isDisabled={isPending}
                />
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isPending={isPending}
                >
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
