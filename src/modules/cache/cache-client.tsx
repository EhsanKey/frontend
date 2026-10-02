'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientAiCacheServices, type AiCacheInvalidateDto } from '@/apis/services/ai-cache';
import { hasPermission } from '@/utils';
import { CacheStats } from './cache-stats';
import { CacheFilters } from './cache-filters';
import { CacheTable } from './cache-table';
import { CacheDetailsModal } from './cache-modals/cache-details-modal';
import { CacheInvalidateModal } from './cache-modals/cache-invalidate-modal';
import { CacheFlushModal } from './cache-modals/cache-flush-modal';
import { CacheDeleteModal } from './cache-modals/cache-delete-modal';
import type { CacheClientProps } from './types';
import type { IAiCacheEntry } from '@/models';

export const CacheClient = ({
  initialEntries,
  initialStats,
}: CacheClientProps) => {
  const t = useTranslations('cache');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canManageCache = hasPermission(user, 'cache:manage');

  const search = getQuery('search') ?? '';
  const intent = getQuery('intent') ?? 'all';
  const sortBy = getQuery('sortBy') ?? 'lastHitAt';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedEntry, setSelectedEntry] = useState<IAiCacheEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInvalidateOpen, setIsInvalidateOpen] = useState(false);
  const [isFlushOpen, setIsFlushOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<IAiCacheEntry | null>(null);

  // Queries
  const { data: entriesData, isLoading: isLoadingEntries } = useGetRequest({
    queryKey: QUERY_KEYS.cache.list({ page, search, intent, sortBy }),
    requestFn: () =>
      clientAiCacheServices.getCacheEntries({
        page,
        pageSize: 25,
        search: search || undefined,
        intent: intent !== 'all' ? intent : undefined,
        sortBy,
        sortOrder: 'desc',
      }),
    initialData: initialEntries,
  });

  const { data: statsData, isLoading: isLoadingStats } = useGetRequest({
    queryKey: QUERY_KEYS.cache.stats,
    requestFn: () => clientAiCacheServices.getCacheStats(),
    initialData: initialStats,
  });

  // Mutations
  const { mutateAsync: invalidateMutate, isPending: isInvalidating } = usePostRequest({
    requestFn: (payload: AiCacheInvalidateDto) =>
      clientAiCacheServices.invalidateCache(payload),
    onSuccess: (res) => {
      toast.success(t('invalidateModal.success', { count: res.deletedCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cache.all });
    },
  });

  const { mutateAsync: flushMutate, isPending: isFlushing } = usePostRequest({
    requestFn: () => clientAiCacheServices.flushCache(),
    onSuccess: (res) => {
      toast.success(t('flushModal.success', { count: res.deletedCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cache.all });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientAiCacheServices.deleteCacheEntry(id),
    onSuccess: () => {
      toast.success(t('deleteModal.success'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cache.all });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Stats Summary Cards */}
      <CacheStats stats={statsData} isLoading={isLoadingStats} />

      {/* Filters Toolbar */}
      <CacheFilters
        search={search}
        intent={intent}
        sortBy={sortBy}
        onSearchChange={(val) => {
          updateQueries({ search: val || null, page: null });
        }}
        onIntentChange={(val) => {
          updateQueries({ intent: val === 'all' ? null : val, page: null });
        }}
        onSortByChange={(val) => {
          updateQueries({ sortBy: val === 'lastHitAt' ? null : val, page: null });
        }}
        onOpenInvalidateModal={canManageCache ? () => setIsInvalidateOpen(true) : undefined}
        onOpenFlushModal={canManageCache ? () => setIsFlushOpen(true) : undefined}
      />

      {/* Table */}
      <CacheTable
        data={entriesData}
        isLoading={isLoadingEntries}
        onPageChange={(newPage) => {
          updateQueries({ page: newPage > 1 ? String(newPage) : null });
        }}
        onViewDetails={(entry) => {
          setSelectedEntry(entry);
          setIsDetailsOpen(true);
        }}
        onDeleteEntry={canManageCache ? (entry) => setEntryToDelete(entry) : undefined}
      />

      {/* Modals */}
      <CacheDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
      />

      <CacheInvalidateModal
        isOpen={isInvalidateOpen}
        onClose={() => setIsInvalidateOpen(false)}
        onInvalidate={async (payload) => {
          await invalidateMutate(payload);
        }}
        isPending={isInvalidating}
      />

      <CacheFlushModal
        isOpen={isFlushOpen}
        onClose={() => setIsFlushOpen(false)}
        onFlush={async () => {
          await flushMutate();
        }}
        isPending={isFlushing}
      />

      <CacheDeleteModal
        isOpen={Boolean(entryToDelete)}
        onClose={() => setEntryToDelete(null)}
        entry={entryToDelete}
        onDelete={async (id) => {
          await deleteMutate(id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
};
