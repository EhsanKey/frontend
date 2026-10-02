'use client';

import { Button, Modal, Spinner } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { InputField } from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { usePostRequest } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientCrawlerServices,
  type CrawlerMessageDto,
  type RejectCrawlerReviewDto,
} from '@/apis/services/crawler';
import {
  crawlerRejectSchema,
  type CrawlerRejectFormValues,
} from '../schemas/crawler-reject.schema';

interface CrawlerReviewRejectModalProps {
  message: CrawlerMessageDto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CrawlerReviewRejectModal = ({
  message,
  isOpen,
  onOpenChange,
}: CrawlerReviewRejectModalProps) => {
  const t = useTranslations('crawler.reviews.rejectModal');
  const tToast = useTranslations('crawler.reviews.toast');
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CrawlerRejectFormValues>({
    resolver: zodResolver(crawlerRejectSchema) as any,
    defaultValues: {
      reason: '',
    },
  });

  const { mutateAsync: rejectReview, isPending } = usePostRequest<
    { id: string; data: RejectCrawlerReviewDto },
    CrawlerMessageDto
  >({
    requestFn: ({ id, data }) => clientCrawlerServices.rejectCrawlerReview(id, data),
    getSuccessDescription: () => tToast('rejected'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
    },
  });

  if (!message) return null;

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: CrawlerRejectFormValues) => {
    await rejectReview({
      id: message.id,
      data: { reason: values.reason?.trim() || null },
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="cover" className="max-w-md w-full p-2 sm:p-4 my-auto">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-danger-600">
                <AlertCircle className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>{t('title')}</Modal.Heading>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="line-clamp-3 text-caption text-neutral-600 leading-relaxed font-normal">
                  {message.content}
                </p>
              </div>

              <Controller
                control={control}
                name="reason"
                render={({ field, fieldState }) => (
                  <InputField
                    label={t('reasonLabel')}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder={t('reasonPlaceholder')}
                    errorMessage={fieldState.error?.message}
                    isInvalid={Boolean(fieldState.error)}
                    isDisabled={isPending}
                  />
                )}
              />
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                onPress={handleClose}
                isDisabled={isPending}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="danger"
                onPress={() => void handleSubmit(onSubmit)()}
                isDisabled={isPending}
                className="gap-1.5"
              >
                {isPending ? (
                  <Spinner size="sm" />
                ) : (
                  <X className={ICON_SIZE_CLASS.sm} />
                )}
                <span>{t('submitReject')}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
