'use client';

import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { CreateCampusDto, UpdateCampusDto } from '@/apis/services/campuses/_dto';
import type { ICampus, IUniversity } from '@/models';
import { InputField } from '@/components/shared';

interface CampusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCampusDto | UpdateCampusDto) => Promise<void>;
  campus: ICampus | null;
  universities: IUniversity[];
  isPending?: boolean;
}

interface FormValues {
  name: string;
  universityId: string;
}

export const CampusFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  campus,
  universities,
  isPending = false,
}: CampusFormModalProps) => {
  const t = useTranslations('campuses');
  const tCommon = useTranslations('common');
  const isEdit = Boolean(campus);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      universityId: '',
    },
  });

  useEffect(() => {
    if (campus) {
      reset({
        name: campus.name,
        universityId: campus.universityId || '',
      });
    } else {
      reset({
        name: '',
        universityId: universities[0]?.id || '',
      });
    }
  }, [campus, universities, reset, isOpen]);

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

                <Controller
                  control={control}
                  name="universityId"
                  rules={{ required: t('validation.universityRequired') }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>{t('fields.university')}</Label>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(String(key))}
                        isDisabled={isPending}
                        className="w-full"
                        aria-label={t('fields.university')}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox aria-label={t('fields.university')}>
                            {universities.map((u) => (
                              <ListBox.Item key={u.id} id={u.id} textValue={u.name}>
                                {u.name}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {fieldState.error ? (
                        <p className="text-caption text-danger-500">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
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
