'use client';

import { Button, toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ChannelsStats } from './channels-stats';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientCrawlerServices } from '@/apis/services/crawler/client';
import type {
  PaginatedResult,
} from '@/apis/core/types/api-response';
import type {
  TrackedChannelDto,
  TrackedChannelStatus,
  UpdateTrackedChannelDto,
} from '@/apis/services/crawler';
import { ChannelsFilterBar } from './channels-filter-bar';
import { ChannelsTable } from './channels-table';
import { AddChannelModal } from './modals/add-channel-modal';
import { DeleteChannelModal } from './modals/delete-channel-modal';

interface CrawlerChannelsClientProps {
  initialData?: PaginatedResult<TrackedChannelDto>;
}

export const CrawlerChannelsClient = ({ initialData }: CrawlerChannelsClientProps) => {
  const t = useTranslations('crawler.channels');
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChannelForDelete, setSelectedChannelForDelete] = useState<TrackedChannelDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // URL Query State (Standard Monorepo Pattern)
  const page = Number(getQuery('page')) || 1;
  const search = getQuery('search') ?? '';
  const status = (getQuery('status') as TrackedChannelStatus | 'all') ?? 'all';
  const universityId = getQuery('universityId') ?? '';
  const campusId = getQuery('campusId') ?? '';
  const majorId = getQuery('majorId') ?? '';

  // Data fetching using standardized useGetRequest
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.crawler.channelList({
      page,
      pageSize: 15,
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      universityId: universityId || undefined,
      campusId: campusId || undefined,
      majorId: majorId || undefined,
    }),
    requestFn: () =>
      clientCrawlerServices.getTrackedChannels({
        page,
        pageSize: 15,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        universityId: universityId || undefined,
        campusId: campusId || undefined,
        majorId: majorId || undefined,
      }),
    initialData,
  });

  // Mutations using standardized usePostRequest
  const { mutateAsync: updateChannelMutate } = usePostRequest({
    requestFn: ({ id, data: updateData }: { id: string; data: UpdateTrackedChannelDto }) =>
      clientCrawlerServices.updateTrackedChannel(id, updateData),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.updated'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
    },
  });

  const { mutateAsync: deleteChannelMutate, isPending: isDeleting } = usePostRequest({
    requestFn: ({ id, deleteMessages }: { id: string; deleteMessages?: boolean }) =>
      clientCrawlerServices.deleteTrackedChannel(id, { deleteMessages }),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.folderChannels });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
    },
  });

  const { mutateAsync: triggerSyncMutate } = usePostRequest({
    requestFn: (id: string) => clientCrawlerServices.triggerChannelSync(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.syncTriggered'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
    },
  });

  const { mutateAsync: syncAllMutate, isPending: isSyncingAll } = usePostRequest({
    requestFn: () => clientCrawlerServices.syncAllChannels(),
    showSuccessToast: false,
    onSuccess: (res: any) => {
      if (res?.success) {
        const count = res.newMessagesCount ?? 0;
        if (count > 0) {
          toast.success(t('toast.syncAllSuccess', { count }));
        } else {
          toast.info(t('toast.syncAllNoNew'));
        }
      } else {
        toast.warning(res?.message || t('toast.serviceUnavailable'));
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
    },
  });

  // Accurate Metrics Stats
  const stats = useMemo(() => {
    const backendStats = (data?.meta as any)?.stats || (data as any)?.stats;
    if (backendStats) {
      return {
        total: Number(backendStats.total) || 0,
        active: Number(backendStats.active) || 0,
        backfilling: Number(backendStats.backfilling) || 0,
        totalCollected: Number(backendStats.totalCollected) || 0,
      };
    }

    const items = data?.items || [];
    const total = data?.meta?.total || items.length;
    const active = items.filter((c) => c.status === 'active').length;
    const backfilling = items.filter((c) => c.backfillStatus === 'in_progress').length;
    const totalCollected = items.reduce((acc, c) => acc + (c.totalMessagesCollected || 0), 0);

    return { total, active, backfilling, totalCollected };
  }, [data]);

  const handleToggleStatus = async (channel: TrackedChannelDto) => {
    const newStatus: TrackedChannelStatus = channel.status === 'active' ? 'paused' : 'active';
    await updateChannelMutate({
      id: channel.id,
      data: { status: newStatus },
    });
  };

  const handleDelete = (channel: TrackedChannelDto) => {
    setSelectedChannelForDelete(channel);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (channelId: string, deleteMessages: boolean) => {
    await deleteChannelMutate({ id: channelId, deleteMessages });
  };

  const handleClearFilters = () => {
    updateQueries({
      search: null,
      status: null,
      universityId: null,
      campusId: null,
      majorId: null,
      page: null,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-xs sm:text-display-sm font-bold text-neutral-900">
            {t('title')}
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            {t('description')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            isDisabled={isSyncingAll}
            onPress={() => void syncAllMutate()}
            className="gap-2 shadow-sm font-medium border-neutral-200 hover:bg-neutral-50"
          >
            <RotateCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin text-primary-600' : 'text-neutral-600'}`} />
            <span>{isSyncingAll ? t('table.triggerSync') + '...' : t('syncAll')}</span>
          </Button>

          <Button
            variant="primary"
            onPress={() => setIsAddModalOpen(true)}
            className="gap-2 shadow-sm font-medium"
          >
            <Plus className={ICON_SIZE_CLASS.sm} />
            <span>{t('addChannel')}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Stats Cards */}
      <ChannelsStats stats={stats} />

      {/* Filters Bar */}
      <ChannelsFilterBar
        search={search}
        status={status}
        universityId={universityId}
        campusId={campusId}
        majorId={majorId}
        onSearchChange={(newSearch) => updateQueries({ search: newSearch || null, page: null })}
        onStatusChange={(newStatus) => updateQueries({ status: newStatus === 'all' ? null : newStatus, page: null })}
        onUniversityChange={(newUni) =>
          updateQueries({ universityId: newUni || null, campusId: null, majorId: null, page: null })
        }
        onCampusChange={(newCamp) =>
          updateQueries({ campusId: newCamp || null, majorId: null, page: null })
        }
        onMajorChange={(newMaj) => updateQueries({ majorId: newMaj || null, page: null })}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <ChannelsTable
        data={data}
        isLoading={isLoading}
        onPageChange={(newPage) => updateQueries({ page: newPage === 1 ? null : newPage })}
        onTriggerSync={(ch) => void triggerSyncMutate(ch.id)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Delete Channel Confirmation Modal */}
      <DeleteChannelModal
        channel={selectedChannelForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
};
