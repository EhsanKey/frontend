'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { hasPermission } from '@/utils';
import { clientMajorServices } from '@/apis/services/majors/client';
import { MajorsFilters } from './majors-filters';
import { MajorDeleteModal } from './majors-modal/major-delete-modal';
import { MajorFormModal } from './majors-modal/major-form-modal';
import { MajorsTable } from './majors-table';
import type { CreateMajorDto, UpdateMajorDto } from '@/apis/services/majors/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IMajor } from '@/models';

interface MajorsClientProps {
  initialData?: PaginatedResult<IMajor>;
}

export const MajorsClient = ({ initialData }: MajorsClientProps) => {
  const t = useTranslations('majors');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'majors:create');
  const canUpdate = hasPermission(user, 'majors:update');
  const canDelete = hasPermission(user, 'majors:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedMajor, setSelectedMajor] = useState<IMajor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.majors.list({ page, search }),
    requestFn: () =>
      clientMajorServices.getMajors({
        page,
        search: search || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateMajorDto | UpdateMajorDto) => {
      if (selectedMajor) {
        return clientMajorServices.updateMajor(selectedMajor.id, payload);
      }
      return clientMajorServices.createMajor(payload as CreateMajorDto);
    },
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(selectedMajor ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.majors.lists });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientMajorServices.deleteMajor(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.majors.lists });
    },
  });

  const handleCreateClick = () => {
    setSelectedMajor(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (major: IMajor) => {
    setSelectedMajor(major);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (major: IMajor) => {
    setSelectedMajor(major);
    setIsDeleteOpen(true);
  };

  const handleSearchChange = (value: string) => {
    updateQueries({ search: value || null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateQueries({ page: newPage > 1 ? String(newPage) : null });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      <MajorsFilters
        search={search}
        onSearchChange={handleSearchChange}
        onCreateClick={canCreate ? handleCreateClick : undefined}
      />

      <MajorsTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      <MajorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
        major={selectedMajor}
        isPending={isSaving}
      />

      <MajorDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedMajor) {
            await deleteMutate(selectedMajor.id);
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
};
