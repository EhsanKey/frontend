'use client';

import { toast } from '@heroui/react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { hasPermission } from '@/utils';
import useAuth from './use-auth';
import { usePostRequest } from './use-post-request';
import { useQueryState } from './use-query-state';

export interface EntityCrudMessages {
  created: string;
  updated: string;
  deleted: string;
}

export interface UseEntityCrudOptions<TCreate, TUpdate> {
  createEntity: (payload: TCreate) => Promise<unknown>;
  updateEntity: (id: string, payload: TUpdate) => Promise<unknown>;
  deleteEntity: (id: string) => Promise<unknown>;
  /** Query keys invalidated after every successful mutation. */
  invalidationKeys: readonly QueryKey[];
  /** e.g. `majors` -> checks `majors:create` / `:update` / `:delete`. */
  permissionPrefix?: string;
  messages: EntityCrudMessages;
  showSuccessToast?: boolean;
  /** Extra filter query keys (besides `search`) exposed as `filters` / `setFilter`. */
  filterKeys?: readonly string[];
}

export interface UseEntityCrudResult<TEntity, TCreate, TUpdate> {
  search: string;
  page: number;
  filters: Record<string, string>;
  selectedEntity: TEntity | null;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  openCreate: () => void;
  openEdit: (entity: TEntity) => void;
  openDelete: (entity: TEntity) => void;
  closeForm: () => void;
  closeDelete: () => void;
  setFilter: (key: string, value: string) => void;
  handleSearchChange: (value: string) => void;
  handlePageChange: (page: number) => void;
  handleSave: (payload: TCreate | TUpdate) => Promise<void>;
  handleDelete: () => Promise<void>;
}

/**
 * Shared CRUD state machine for the list pages (search + page query state, selection,
 * modal visibility, save/delete mutations, permission checks and cache invalidation).
 *
 * Extracted from the six `*-client.tsx` list containers that previously repeated the
 * same ~90 lines of wiring for universities, campuses, majors, courses, professors
 * and teachings.
 */
export function useEntityCrud<TEntity extends { id: string }, TCreate, TUpdate>({
  createEntity,
  updateEntity,
  deleteEntity,
  invalidationKeys,
  permissionPrefix,
  messages,
  showSuccessToast = false,
  filterKeys = [],
}: UseEntityCrudOptions<TCreate, TUpdate>): UseEntityCrudResult<TEntity, TCreate, TUpdate> {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const canCreate = permissionPrefix
    ? hasPermission(user, `${permissionPrefix}:create`)
    : false;
  const canUpdate = permissionPrefix
    ? hasPermission(user, `${permissionPrefix}:update`)
    : false;
  const canDelete = permissionPrefix
    ? hasPermission(user, `${permissionPrefix}:delete`)
    : false;

  const invalidate = useCallback(() => {
    for (const queryKey of invalidationKeys) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [invalidationKeys, queryClient]);

  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest<
    TCreate | TUpdate,
    unknown
  >({
    requestFn: (payload) => {
      if (selectedEntity) {
        return updateEntity(selectedEntity.id, payload as TUpdate);
      }
      return createEntity(payload as TCreate);
    },
    showSuccessToast,
    onSuccess: () => {
      toast.success(
        selectedEntity ? messages.updated : messages.created,
      );
      invalidate();
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest<
    string,
    unknown
  >({
    requestFn: (id) => deleteEntity(id),
    showSuccessToast,
    onSuccess: () => {
      toast.success(messages.deleted);
      invalidate();
    },
  });

  const openCreate = useCallback(() => {
    setSelectedEntity(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((entity: TEntity) => {
    setSelectedEntity(entity);
    setIsFormOpen(true);
  }, []);

  const openDelete = useCallback((entity: TEntity) => {
    setSelectedEntity(entity);
    setIsDeleteOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setIsDeleteOpen(false), []);

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  const filters = filterKeys.reduce<Record<string, string>>(
    (accumulator, key) => {
      accumulator[key] = getQuery(key) ?? '';
      return accumulator;
    },
    {},
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      updateQueries({ search: value || null, page: null });
    },
    [updateQueries],
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      updateQueries({ [key]: value || null, page: null });
    },
    [updateQueries],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateQueries({ page: nextPage > 1 ? String(nextPage) : null });
    },
    [updateQueries],
  );

  const handleSave = useCallback(
    async (payload: TCreate | TUpdate) => {
      await saveMutate(payload);
    },
    [saveMutate],
  );

  const handleDelete = useCallback(async () => {
    if (selectedEntity) {
      await deleteMutate(selectedEntity.id);
    }
  }, [deleteMutate, selectedEntity]);

  return {
    search,
    page,
    filters,
    selectedEntity,
    isFormOpen,
    isDeleteOpen,
    isSaving,
    isDeleting,
    canCreate,
    canUpdate,
    canDelete,
    openCreate,
    openEdit,
    openDelete,
    closeForm,
    closeDelete,
    setFilter,
    handleSearchChange,
    handlePageChange,
    handleSave,
    handleDelete,
  };
}

export default useEntityCrud;
