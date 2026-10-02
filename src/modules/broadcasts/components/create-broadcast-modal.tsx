'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  toast,
} from '@heroui/react';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  InlineKeyboardBuilder,
  TelegramEditor,
  TelegramLivePreview,
} from '@/components/shared';
import { AudienceFilterCard } from './audience-filter-card';

import type {
  CreateBroadcastDto,
  InlineKeyboardRowDto,
  BroadcastTargetFiltersDto,
} from '@/apis/services/broadcasts';

interface CreateBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBroadcastDto) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');

  const [title, setTitle] = useState('');
  const [messageText, setMessageText] = useState(t('create.defaultTemplate'));
  const [inlineButtons, setInlineButtons] = useState<InlineKeyboardRowDto[]>([
    [
      {
        id: 'btn-init-1',
        text: t('create.defaultButton'),
        url: 'https://t.me/uni_assistant_bot',
      },
    ],
  ]);
  const [targetFilters, setTargetFilters] = useState<BroadcastTargetFiltersDto>({
    targetType: 'all',
  });
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const [titleError, setTitleError] = useState('');
  const [messageError, setMessageError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!title.trim()) {
      setTitleError(t('validation.titleMin'));
      hasError = true;
    } else {
      setTitleError('');
    }

    if (!messageText.trim()) {
      setMessageError(t('validation.messageMin'));
      hasError = true;
    } else {
      setMessageError('');
    }

    if (hasError) return;

    try {
      await onSubmit({
        title: title.trim(),
        messageText: messageText.trim(),
        parseMode: 'HTML',
        inlineButtons,
        targetFilters,
      });
      toast.success(t('toast.created'));
      onClose();
    } catch (err: unknown) {
      toast.danger((err as Error)?.message || t('toast.createError'));
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="cover" className="max-w-6xl w-full p-2 sm:p-4 my-auto">
          <Modal.Dialog className="max-h-[92vh] flex flex-col">
            <Modal.CloseTrigger />
            <Modal.Header className="border-b border-divider pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Send className="w-5 h-5" />
                <Modal.Heading className="text-base font-bold text-foreground">
                  {t('create.headerTitle')}
                </Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <Modal.Body className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
                {/* Campaign Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>{t('create.subjectLabel')}</span>
                    <span className="text-danger">*</span>
                  </label>
                  <Input
                    placeholder={t('create.subjectPlaceholder')}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError('');
                    }}
                  />
                  {titleError && (
                    <span className="text-xs text-danger font-medium">{titleError}</span>
                  )}
                </div>

                {/* Audience Targeting Card */}
                <AudienceFilterCard
                  filters={targetFilters}
                  onChange={setTargetFilters}
                  onAudienceCountChange={setAudienceCount}
                />

                {/* Grid: Editor + Live Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left (Desktop) / Main: Editor & Button Builder */}
                  <div className="lg:col-span-7 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>{t('editor.htmlNotice')}</span>
                        <span className="text-[11px] text-default-400 font-normal">
                          {t('editor.supportedTags')}
                        </span>
                      </label>
                      <TelegramEditor
                        value={messageText}
                        onChange={(val) => {
                          setMessageText(val);
                          if (messageError) setMessageError('');
                        }}
                        error={messageError}
                      />
                    </div>

                    <InlineKeyboardBuilder
                      rows={inlineButtons}
                      onChange={setInlineButtons}
                    />
                  </div>

                  {/* Right (Desktop): Live Simulated Telegram App Preview */}
                  <div className="lg:col-span-5 flex flex-col gap-2">
                    <div className="sticky top-2">
                      <TelegramLivePreview
                        messageText={messageText}
                        inlineButtons={inlineButtons}
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="border-t border-divider pt-3 pb-2 px-6 flex items-center justify-between">
                <div className="text-xs text-default-500">
                  {t('create.antiSpamNotice', { count: audienceCount.toLocaleString('fa-IR') })}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="md"
                    onPress={onClose}
                    isDisabled={isSubmitting}
                  >
                    {tCommon('actions.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="gap-2"
                    isPending={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('create.submitModal')}</span>
                  </Button>
                </div>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
