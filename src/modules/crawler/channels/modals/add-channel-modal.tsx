'use client';

import { Button, Modal, Spinner, Tabs } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Folder, Globe, Plus, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AcademicScopeFields,
  InputField,
  SwitchField,
} from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { useGetRequest, usePostRequest } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientCrawlerServices,
  type CreateTrackedChannelDto,
  type FolderChannelDto,
  type TrackedChannelDto,
} from '@/apis/services/crawler';
import {
  addChannelSchema,
  type AddChannelFormValues,
} from '../schemas/add-channel.schema';
import { FolderChannelsPicker } from './components/folder-channels-picker';

interface AddChannelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddChannelModal = ({ isOpen, onOpenChange }: AddChannelModalProps) => {
  const t = useTranslations('crawler.channels.modal');
  const tToast = useTranslations('crawler.channels.toast');
  const queryClient = useQueryClient();

  const [selectedFolderChannel, setSelectedFolderChannel] =
    useState<FolderChannelDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<AddChannelFormValues>({
    resolver: zodResolver(addChannelSchema) as any,
    defaultValues: {
      mode: 'public',
      usernameOrLink: '',
      title: '',
      telegramChannelId: '',
      accessHash: null,
      isPrivate: false,
      universityId: '',
      campusId: '',
      majorId: null,
      syncHistorical: true,
    },
    mode: 'onChange',
  });

  const mode = watch('mode');
  const universityId = watch('universityId');
  const campusId = watch('campusId');
  const majorId = watch('majorId') ?? '';
  const syncHistorical = watch('syncHistorical');

  // Queries & Mutations
  const {
    data: folderChannelsData,
    isLoading: isLoadingFolder,
    isFetching: isFetchingFolder,
    refetch: refetchFolder,
  } = useGetRequest<FolderChannelDto[]>({
    queryKey: QUERY_KEYS.crawler.folderChannels,
    requestFn: () => clientCrawlerServices.getFolderChannels(),
    enabled: isOpen && mode === 'folder',
    staleTime: 1000 * 60 * 5,
  });
  const folderChannels = folderChannelsData ?? [];

  const { mutateAsync: addChannel, isPending: isSubmitting } = usePostRequest<
    CreateTrackedChannelDto,
    TrackedChannelDto
  >({
    requestFn: (dto) => clientCrawlerServices.addTrackedChannel(dto),
    getSuccessDescription: () => tToast('created'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.folderChannels });
    },
  });

  const handleClose = () => {
    reset();
    setSelectedFolderChannel(null);
    onOpenChange(false);
  };

  const handleModeChange = (newMode: 'public' | 'folder') => {
    setValue('mode', newMode, { shouldValidate: true });
    if (newMode === 'public') {
      setSelectedFolderChannel(null);
      setValue('telegramChannelId', '');
      setValue('title', '');
    }
  };

  const handleSelectFolderChannel = (channel: FolderChannelDto | null) => {
    setSelectedFolderChannel(channel);
    if (channel) {
      setValue('telegramChannelId', channel.telegramChannelId, { shouldValidate: true });
      setValue('accessHash', channel.accessHash ?? null);
      setValue('title', channel.title, { shouldValidate: true });
      setValue('isPrivate', channel.isPrivate);
    } else {
      setValue('telegramChannelId', '', { shouldValidate: true });
      setValue('accessHash', null);
      setValue('title', '', { shouldValidate: true });
      setValue('isPrivate', false);
    }
  };

  const onSubmit = async (values: AddChannelFormValues) => {
    if (values.mode === 'public') {
      const cleanUsername = (values.usernameOrLink || '')
        .replace(/^https?:\/\/t\.me\//, '')
        .replace(/^@/, '')
        .trim();

      await addChannel({
        username: cleanUsername,
        title: values.title.trim(),
        universityId: values.universityId,
        campusId: values.campusId,
        majorId: values.majorId || null,
        syncHistorical: values.syncHistorical,
        isPrivate: false,
      });
    } else {
      if (!selectedFolderChannel) return;
      await addChannel({
        telegramChannelId: selectedFolderChannel.telegramChannelId,
        accessHash: selectedFolderChannel.accessHash,
        username: selectedFolderChannel.username,
        title: selectedFolderChannel.title,
        isPrivate: selectedFolderChannel.isPrivate,
        sourceFolder: 'uni',
        universityId: values.universityId,
        campusId: values.campusId,
        majorId: values.majorId || null,
        syncHistorical: values.syncHistorical,
      });
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="cover" className="max-w-2xl w-full p-2 sm:p-4 my-auto">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <Send className={ICON_SIZE_CLASS.md} />
                <div>
                  <Modal.Heading>{t('addTitle')}</Modal.Heading>
                  <p className="text-caption text-neutral-500 font-normal mt-0.5">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              {/* Mode Tabs */}
              <Tabs
                selectedKey={mode}
                onSelectionChange={(key) => handleModeChange(key as 'public' | 'folder')}
              >
                <Tabs.List className="border-b border-divider gap-2">
                  <Tabs.Tab id="public" className="gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{t('tabPublic')}</span>
                  </Tabs.Tab>
                  <Tabs.Tab id="folder" className="gap-2">
                    <Folder className="w-4 h-4" />
                    <span>{t('tabUniFolder')}</span>
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>

              {/* Tab 1: Public Channel Inputs */}
              {mode === 'public' && (
                <div className="flex flex-col gap-3">
                  <Controller
                    control={control}
                    name="usernameOrLink"
                    render={({ field, fieldState }) => (
                      <InputField
                        label={t('channelUsername')}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          const currentTitle = watch('title');
                          if (!currentTitle) {
                            const clean = e.target.value
                              .replace(/^https?:\/\/t\.me\//, '')
                              .replace(/^@/, '')
                              .trim();
                            if (clean) setValue('title', clean, { shouldValidate: true });
                          }
                        }}
                        placeholder={t('channelUsernamePlaceholder')}
                        errorMessage={fieldState.error?.message}
                        isInvalid={Boolean(fieldState.error)}
                        isDisabled={isSubmitting}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <InputField
                        label={t('channelTitle')}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('channelTitlePlaceholder')}
                        errorMessage={fieldState.error?.message}
                        isInvalid={Boolean(fieldState.error)}
                        isDisabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              )}

              {/* Tab 2: Folder Channels List */}
              {mode === 'folder' && (
                <FolderChannelsPicker
                  folderChannels={folderChannels}
                  selectedChannel={selectedFolderChannel}
                  onSelectChannel={handleSelectFolderChannel}
                  isLoading={isLoadingFolder}
                  isFetching={isFetchingFolder}
                  onRefetch={refetchFolder}
                  isDisabled={isSubmitting}
                />
              )}

              {/* Shared Academic Scope Fields */}
              <AcademicScopeFields
                universityId={universityId}
                campusId={campusId}
                majorId={majorId}
                onUniversityChange={(uId) =>
                  setValue('universityId', uId, { shouldValidate: true })
                }
                onCampusChange={(cId) =>
                  setValue('campusId', cId, { shouldValidate: true })
                }
                onMajorChange={(mId) => setValue('majorId', mId || null)}
                title={t('academicScopeSection')}
                isDisabled={isSubmitting}
              />

              {/* Historical Crawl Switch */}
              <SwitchField
                label={t('syncHistoricalLabel')}
                description={t('syncHistoricalDesc')}
                isSelected={syncHistorical}
                onChange={(val) => setValue('syncHistorical', val)}
                isDisabled={isSubmitting}
              />
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                onPress={handleClose}
                isDisabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                onPress={() => void handleSubmit(onSubmit)()}
                isDisabled={!isValid || isSubmitting}
                className="gap-1.5"
              >
                {isSubmitting ? (
                  <Spinner size="sm" />
                ) : (
                  <Plus className={ICON_SIZE_CLASS.sm} />
                )}
                <span>{t('submit')}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
