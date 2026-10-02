'use client';

import { Button, toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReviewsStats } from './reviews-stats';
import { QUERY_KEYS } from '@/constants';
import { useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import {
  clientCrawlerServices,
  type CrawlerMessageDto,
  type CrawlerMessageStatus,
} from '@/apis/services/crawler';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import { ReviewsFilterBar } from './reviews-filter-bar';
import { ReviewsTable } from './reviews-table';
import { CrawlerReviewModerationModal } from './modals/crawler-review-moderation-modal';
import { CrawlerReviewRejectModal } from './modals/crawler-review-reject-modal';
import { CrawlerReviewDeleteModal } from './modals/crawler-review-delete-modal';
import { CrawlerReviewBulkDeleteModal } from './modals/crawler-review-bulk-delete-modal';

interface CrawlerReviewsClientProps {
  initialData?: PaginatedResult<CrawlerMessageDto>;
}

export const CrawlerReviewsClient = ({ initialData }: CrawlerReviewsClientProps) => {
  const t = useTranslations('crawler.reviews');
  const tChannels = useTranslations('crawler.channels');
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  // URL Query State (Standard Monorepo Pattern)
  const page = Number(getQuery('page')) || 1;
  const search = getQuery('search') ?? '';
  const status = (getQuery('status') as CrawlerMessageStatus | 'all') ?? 'pending';
  const confidence = (getQuery('confidence') as 'high' | 'medium' | 'low' | 'none' | 'all') ?? 'all';
  const matchFilter = (getQuery('matchFilter') as 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all') ?? 'all';
  const trackedChannelId = getQuery('trackedChannelId') ?? '';
  const universityId = getQuery('universityId') ?? '';
  const campusId = getQuery('campusId') ?? '';
  const majorId = getQuery('majorId') ?? '';

  // Row selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal states
  const [selectedMessageForModeration, setSelectedMessageForModeration] = useState<CrawlerMessageDto | null>(null);
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);

  const [selectedMessageForReject, setSelectedMessageForReject] = useState<CrawlerMessageDto | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedMessageForDelete, setSelectedMessageForDelete] = useState<CrawlerMessageDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Data fetching using standardized useGetRequest
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.crawler.messageList({
      page,
      pageSize: 15,
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      confidence: confidence !== 'all' ? confidence : undefined,
      matchFilter: matchFilter !== 'all' ? matchFilter : undefined,
      trackedChannelId: trackedChannelId || undefined,
      universityId: universityId || undefined,
      campusId: campusId || undefined,
      majorId: majorId || undefined,
    }),
    requestFn: () =>
      clientCrawlerServices.getCrawlerMessages({
        page,
        pageSize: 15,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        confidence: confidence !== 'all' ? confidence : undefined,
        matchFilter: matchFilter !== 'all' ? matchFilter : undefined,
        trackedChannelId: trackedChannelId || undefined,
        universityId: universityId || undefined,
        campusId: campusId || undefined,
        majorId: majorId || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: syncAllMutate, isPending: isSyncing } = usePostRequest({
    requestFn: () => clientCrawlerServices.syncAllChannels(),
    showSuccessToast: false,
    onSuccess: (res: any) => {
      if (res?.success) {
        const count = res.newMessagesCount ?? 0;
        if (count > 0) {
          toast.success(tChannels('toast.syncAllSuccess', { count }));
        } else {
          toast.info(tChannels('toast.syncAllNoNew'));
        }
      } else {
        toast.warning(res?.message || tChannels('toast.serviceUnavailable'));
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
    },
  });

  const { mutateAsync: deleteMessageMutate, isPending: isDeletingSingle } = usePostRequest({
    requestFn: (id: string) => clientCrawlerServices.deleteCrawlerMessage(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      setSelectedIds((prev) => prev.filter((id) => id !== selectedMessageForDelete?.id));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
    },
  });

  const { mutateAsync: bulkDeleteMutate, isPending: isBulkDeleting } = usePostRequest({
    requestFn: (ids: string[]) => clientCrawlerServices.bulkDeleteCrawlerMessages(ids),
    showSuccessToast: false,
    onSuccess: (res: any) => {
      const count = res?.deletedCount ?? selectedIds.length;
      toast.success(t('toast.bulkDeleted', { count }));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
    },
  });

  // Auto-sync new reviews on entering page (once per mount)
  const hasAutoSyncedRef = useRef(false);
  useEffect(() => {
    if (!hasAutoSyncedRef.current) {
      hasAutoSyncedRef.current = true;
      clientCrawlerServices
        .syncAllChannels()
        .then((res) => {
          if (res?.success && (res?.newMessagesCount ?? 0) > 0) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.channels });
          }
        })
        .catch(() => {});
    }
  }, [queryClient]);

  // Aggregate stats from backend or fallback to items count
  const stats = useMemo(() => {
    const backendStats = (data?.meta as any)?.stats || (data as any)?.stats;
    if (backendStats) {
      return {
        total: Number(backendStats.total) || 0,
        pending: Number(backendStats.pending) || 0,
        approved: Number(backendStats.approved) || 0,
        rejected: Number(backendStats.rejected) || 0,
        ignored: Number(backendStats.ignored) || 0,
      };
    }

    const items = data?.items || [];
    const total = data?.meta?.total || items.length;
    const pending = items.filter((m) => m.status === 'pending').length;
    const approved = items.filter((m) => m.status === 'approved').length;
    const rejected = items.filter((m) => m.status === 'rejected').length;
    const ignored = items.filter((m) => m.status === 'ignored').length;

    return { total, pending, approved, rejected, ignored };
  }, [data]);

  const handleModerate = (message: CrawlerMessageDto) => {
    setSelectedMessageForModeration(message);
    setIsModerationModalOpen(true);
  };

  const handleReject = (message: CrawlerMessageDto) => {
    setSelectedMessageForReject(message);
    setIsRejectModalOpen(true);
  };

  const handleDelete = (message: CrawlerMessageDto) => {
    setSelectedMessageForDelete(message);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (messageId: string) => {
    await deleteMessageMutate(messageId);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    await bulkDeleteMutate(selectedIds);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const pageIds = (data?.items || []).map((m) => m.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set((data?.items || []).map((m) => m.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const handlePageChange = (newPage: number) => {
    updateQueries({ page: newPage === 1 ? null : newPage });
  };

  const handleSearchChange = (val: string) => {
    updateQueries({ search: val || null, page: null });
  };

  const handleStatusChange = (val: CrawlerMessageStatus | 'all') => {
    updateQueries({ status: val === 'pending' ? null : val, page: null });
  };

  const handleConfidenceChange = (val: 'high' | 'medium' | 'low' | 'none' | 'all') => {
    if (val === 'low' && status === 'pending') {
      updateQueries({ confidence: val, status: 'all', page: null });
      return;
    }
    updateQueries({ confidence: val === 'all' ? null : val, page: null });
  };

  const handleMatchFilterChange = (val: 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all') => {
    updateQueries({ matchFilter: val === 'all' ? null : val, page: null });
  };

  const handleTrackedChannelChange = (val: string) => {
    updateQueries({ trackedChannelId: val || null, page: null });
  };

  const handleUniversityChange = (val: string) => {
    updateQueries({
      universityId: val || null,
      campusId: null,
      majorId: null,
      page: null,
    });
  };

  const handleCampusChange = (val: string) => {
    updateQueries({
      campusId: val || null,
      majorId: null,
      page: null,
    });
  };

  const handleMajorChange = (val: string) => {
    updateQueries({
      majorId: val || null,
      page: null,
    });
  };

  const handleClearFilters = () => {
    updateQueries({
      page: null,
      search: null,
      status: null,
      confidence: null,
      matchFilter: null,
      trackedChannelId: null,
      universityId: null,
      campusId: null,
      majorId: null,
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

        <Button
          variant="outline"
          isDisabled={isSyncing}
          onPress={() => syncAllMutate()}
          className="gap-2 shadow-sm font-medium border-neutral-200 hover:bg-neutral-50"
        >
          <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-primary-600' : 'text-neutral-600'}`} />
          <span>{isSyncing ? t('syncing') : t('syncLatest')}</span>
        </Button>
      </div>

      {/* Metrics Stats Cards */}
      <ReviewsStats
        stats={stats}
        activeStatus={status}
        onSelectStatus={handleStatusChange}
      />

      {/* Filters Bar */}
      <ReviewsFilterBar
        search={search}
        status={status}
        confidence={confidence}
        matchFilter={matchFilter}
        trackedChannelId={trackedChannelId}
        universityId={universityId}
        campusId={campusId}
        majorId={majorId}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onConfidenceChange={handleConfidenceChange}
        onMatchFilterChange={handleMatchFilterChange}
        onTrackedChannelChange={handleTrackedChannelChange}
        onUniversityChange={handleUniversityChange}
        onCampusChange={handleCampusChange}
        onMajorChange={handleMajorChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <ReviewsTable
        data={data}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onPageChange={handlePageChange}
        onModerate={handleModerate}
        onReject={handleReject}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      {/* Moderation Modal */}
      <CrawlerReviewModerationModal
        message={selectedMessageForModeration}
        isOpen={isModerationModalOpen}
        onOpenChange={setIsModerationModalOpen}
        onRejectRequest={(msg) => {
          setSelectedMessageForReject(msg);
          setIsRejectModalOpen(true);
        }}
      />

      {/* Reject Modal */}
      <CrawlerReviewRejectModal
        message={selectedMessageForReject}
        isOpen={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
      />

      {/* Single Delete Confirmation Modal */}
      <CrawlerReviewDeleteModal
        message={selectedMessageForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isDeletingSingle}
      />

      {/* Bulk Delete Confirmation Modal */}
      <CrawlerReviewBulkDeleteModal
        selectedCount={selectedIds.length}
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isPending={isBulkDeleting}
      />
    </div>
  );
};
