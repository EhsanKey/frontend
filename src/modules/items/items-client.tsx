'use client';

import { Button } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { clientItemServices } from '@/apis/services/items/client';
import { ICON_SIZE_CLASS, PAGE_SIZE, QUERY_KEYS } from '@/constants';
import { useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import ItemsFilters from './items-filters';
import ItemDeleteModal from './items-modal/item-delete-modal';
import ItemFormModal from './items-modal/item-form-modal';
import ItemsTable from './items-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IItem } from '@/models';
import type { ItemFormValues } from './items-modal/item-form.schema';

type ItemsClientProps = {
  initialData: PaginatedResult<IItem>;
};

export const ItemsClient = ({ initialData }: ItemsClientProps) => {
  const t = useTranslations('items');
  const tCommon = useTranslations('common.actions');
  const queryClient = useQueryClient();
  const { values, updateQueries, removeQueries } = useQueryState();

  const search = values.search || '';
  const status = values.status || 'all';
  const category = values.category || 'all';
  const page = Number(values.page) || 1;

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<IItem | null>(null);

  // TanStack Query for items list
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.items.list({ page, perPage: PAGE_SIZE, search, status, category }),
    requestFn: (signal) =>
      clientItemServices.getItems(
        {
          page,
          perPage: PAGE_SIZE,
          search: search || undefined,
          status: status !== 'all' ? status : undefined,
          category: category !== 'all' ? category : undefined,
        },
        signal,
      ),
    initialData,
    keepPreviousData: true,
  });

  // Create mutation
  const { mutateAsync: createItem, isPending: isCreating } = usePostRequest<
    ItemFormValues,
    IItem
  >({
    requestFn: (payload) => clientItemServices.createItem(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.lists });
    },
  });

  // Update mutation
  const { mutateAsync: updateItem, isPending: isUpdating } = usePostRequest<
    { id: number; data: Partial<ItemFormValues> },
    IItem
  >({
    requestFn: ({ id, data }) => clientItemServices.updateItem(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.lists });
    },
  });

  // Delete mutation
  const { mutateAsync: deleteItem, isPending: isDeleting } = usePostRequest<
    number,
    { success: boolean }
  >({
    requestFn: (id) => clientItemServices.deleteItem(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.lists });
    },
  });

  // Handlers for URL queries
  const handleSearchChange = (newSearch: string) => {
    updateQueries({
      search: newSearch || null,
      page: null,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateQueries({
      status: newStatus !== 'all' ? newStatus : null,
      page: null,
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    updateQueries({
      category: newCategory !== 'all' ? newCategory : null,
      page: null,
    });
  };

  const handleResetFilters = () => {
    removeQueries(['search', 'status', 'category', 'page']);
  };

  // Handlers for modal actions
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (item: IItem) => {
    setEditingItem(item);
    setFormModalOpen(true);
  };

  const handleOpenDeleteModal = (item: IItem) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleSaveItem = async (formValues: ItemFormValues) => {
    if (editingItem) {
      await updateItem({ id: editingItem.id, data: formValues });
    } else {
      await createItem(formValues);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingItem) {
      await deleteItem(deletingItem.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">{t('title')}</h1>
          <p className="mt-1 text-body-sm text-neutral-500">{t('description')}</p>
        </div>

        <Button
          size="md"
          variant="primary"
          onPress={handleOpenCreateModal}
        >
          <Plus className={ICON_SIZE_CLASS.sm} />
          {tCommon('create')}
        </Button>
      </div>

      {/* Filters */}
      <ItemsFilters
        search={search}
        status={status}
        category={category}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <ItemsTable
        items={data?.items ?? []}
        pagination={data?.meta}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* Form Modal (Create / Edit) */}
      <ItemFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSaveItem}
        initialData={editingItem}
        isPending={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ItemDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={deletingItem?.title}
        isPending={isDeleting}
      />
    </div>
  );
};

export default ItemsClient;
