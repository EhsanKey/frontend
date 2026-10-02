'use client';

import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputField } from '@/components/shared';
import { createItemFormSchema, type ItemFormValues } from './item-form.schema';
import type { IItem } from '@/models';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  initialData?: IItem | null;
  isPending?: boolean;
}

export const ItemFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending = false,
}: ItemFormModalProps) => {
  const t = useTranslations('items');
  const tCommon = useTranslations('common');
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(
      createItemFormSchema({
        titleRequired: t('validation.titleRequired'),
        categoryRequired: t('validation.categoryRequired'),
        statusRequired: t('validation.statusRequired'),
      })
    ),
    defaultValues: {
      title: '',
      category: 'general',
      status: 'ACTIVE',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        category: initialData.category,
        status: initialData.status,
        description: initialData.description || '',
      });
    } else {
      reset({
        title: '',
        category: 'general',
        status: 'ACTIVE',
        description: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (data: ItemFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {isEdit ? t('modal.editTitle') : t('modal.createTitle')}
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <InputField
                  label={t('fields.title.label')}
                  placeholder={t('fields.title.placeholder')}
                  errorMessage={errors.title?.message}
                  isInvalid={Boolean(errors.title)}
                  isDisabled={isPending}
                  {...register('title')}
                />

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>{t('fields.category.label')}</Label>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(String(key))}
                        variant="secondary"
                        className="w-full"
                        isDisabled={isPending}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox aria-label={t('fields.category.label')}>
                            <ListBox.Item id="general" textValue={t('categories.general')}>
                              {t('categories.general')}
                            </ListBox.Item>
                            <ListBox.Item id="technical" textValue={t('categories.technical')}>
                              {t('categories.technical')}
                            </ListBox.Item>
                            <ListBox.Item id="financial" textValue={t('categories.financial')}>
                              {t('categories.financial')}
                            </ListBox.Item>
                            <ListBox.Item id="administrative" textValue={t('categories.administrative')}>
                              {t('categories.administrative')}
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>{t('fields.status.label')}</Label>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(String(key))}
                        variant="secondary"
                        className="w-full"
                        isDisabled={isPending}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox aria-label={t('fields.status.label')}>
                            <ListBox.Item id="ACTIVE" textValue={tCommon('statuses.active')}>
                              {tCommon('statuses.active')}
                            </ListBox.Item>
                            <ListBox.Item id="PENDING" textValue={tCommon('statuses.pending')}>
                              {tCommon('statuses.pending')}
                            </ListBox.Item>
                            <ListBox.Item id="INACTIVE" textValue={tCommon('statuses.inactive')}>
                              {tCommon('statuses.inactive')}
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  )}
                />

                <InputField
                  label={t('fields.description.label')}
                  placeholder={t('fields.description.placeholder')}
                  isDisabled={isPending}
                  {...register('description')}
                />
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
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

export default ItemFormModal;
