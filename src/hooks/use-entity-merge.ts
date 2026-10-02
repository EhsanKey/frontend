'use client';

import { toast } from '@heroui/react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { hasPermission } from '@/utils';
import useAuth from './use-auth';
import { usePostRequest } from './use-post-request';

export interface UseEntityMergeOptions {
  mergeEntity: (sourceId: string, targetId: string) => Promise<unknown>;
  invalidationKeys: readonly QueryKey[];
  /** e.g. `courses` -> checks `courses:merge`. */
  permissionPrefix: string;
  successMessage: string;
}

export interface UseEntityMergeResult<TEntity> {
  sourceEntity: TEntity | null;
  isOpen: boolean;
  isPending: boolean;
  canMerge: boolean;
  openMerge: (entity: TEntity) => void;
  closeMerge: () => void;
  handleMerge: (targetId: string) => Promise<void>;
}

/**
 * Shared merge (deduplication) state machine for list pages that can transfer
 * relations from a duplicate source record into a target record.
 *
 * Extracted from the duplicated merge wiring in the courses and professors
 * clients (selection state, `*:merge` permission check, mutation and cache
 * invalidation).
 */
export function useEntityMerge<TEntity extends { id: string }>({
  mergeEntity,
  invalidationKeys,
  permissionPrefix,
  successMessage,
}: UseEntityMergeOptions): UseEntityMergeResult<TEntity> {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [sourceEntity, setSourceEntity] = useState<TEntity | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const canMerge = hasPermission(user, `${permissionPrefix}:merge`);

  const { mutateAsync: mergeMutate, isPending } = usePostRequest<
    { sourceId: string; targetId: string },
    unknown
  >({
    requestFn: ({ sourceId, targetId }) => mergeEntity(sourceId, targetId),
    onSuccess: () => {
      toast.success(successMessage);
      for (const queryKey of invalidationKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  const openMerge = useCallback((entity: TEntity) => {
    setSourceEntity(entity);
    setIsOpen(true);
  }, []);

  const closeMerge = useCallback(() => {
    setIsOpen(false);
    setSourceEntity(null);
  }, []);

  const handleMerge = useCallback(
    async (targetId: string) => {
      if (!sourceEntity || targetId === sourceEntity.id) {
        return;
      }

      await mergeMutate({ sourceId: sourceEntity.id, targetId });
      closeMerge();
    },
    [mergeMutate, sourceEntity, closeMerge],
  );

  return {
    sourceEntity,
    isOpen,
    isPending,
    canMerge,
    openMerge,
    closeMerge,
    handleMerge,
  };
}

export default useEntityMerge;