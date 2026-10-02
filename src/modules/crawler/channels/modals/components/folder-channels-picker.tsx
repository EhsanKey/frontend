'use client';

import { Button, Chip, Spinner } from '@heroui/react';
import { Globe, Lock, RefreshCw, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FolderChannelDto } from '@/apis/services/crawler';

export interface FolderChannelsPickerProps {
  folderChannels: FolderChannelDto[];
  selectedChannel: FolderChannelDto | null;
  onSelectChannel: (channel: FolderChannelDto | null) => void;
  isLoading: boolean;
  isFetching: boolean;
  onRefetch: () => void;
  isDisabled?: boolean;
}

export const FolderChannelsPicker = ({
  folderChannels,
  selectedChannel,
  onSelectChannel,
  isLoading,
  isFetching,
  onRefetch,
  isDisabled,
}: FolderChannelsPickerProps) => {
  const t = useTranslations('crawler.channels.modal');
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-caption text-neutral-600 font-medium">
          {t('selectFromFolder')}
        </p>
        <button
          type="button"
          onClick={onRefetch}
          disabled={isLoading || isFetching}
          className="text-[12px] text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          title={tCommon('actions.refresh')}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span>{tCommon('actions.refresh')}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 gap-2 border border-neutral-200 rounded-xl bg-neutral-50">
          <Spinner size="md" />
          <span className="text-caption text-neutral-500">
            {t('folderLoading')}
          </span>
        </div>
      ) : folderChannels.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-neutral-300 rounded-xl bg-neutral-50/50">
          <p className="text-caption text-neutral-500">
            {t('folderEmpty')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {folderChannels.map((channel) => {
            const isSelected =
              selectedChannel?.telegramChannelId === channel.telegramChannelId;
            return (
              <button
                type="button"
                key={channel.telegramChannelId}
                disabled={channel.alreadyTracked || isDisabled}
                onClick={() => onSelectChannel(channel)}
                className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  channel.alreadyTracked
                    ? 'opacity-60 bg-neutral-100 border-neutral-200 cursor-not-allowed'
                    : isSelected
                      ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {channel.isPrivate ? (
                    <Lock className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-primary-500" />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-body-sm font-bold text-neutral-800">
                      {channel.title}
                    </span>
                    {channel.username && (
                      <span className="text-[11px] text-neutral-500 font-mono" dir="ltr">
                        @{channel.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {channel.participantsCount !== undefined && (
                    <span className="text-caption text-neutral-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{channel.participantsCount.toLocaleString('fa-IR')}</span>
                    </span>
                  )}
                  {channel.alreadyTracked && (
                    <Chip size="sm" variant="secondary" className="bg-neutral-200 text-neutral-700">
                      {t('alreadyTrackedBadge')}
                    </Chip>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedChannel && (
        <div className="p-3 bg-primary-50/50 border border-primary-200 rounded-xl flex items-center justify-between">
          <span className="text-caption font-bold text-primary-800">
            {t('selectedFolderChannel', { title: selectedChannel.title })}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => onSelectChannel(null)}
          >
            {t('changeFolderChannel')}
          </Button>
        </div>
      )}
    </div>
  );
};
