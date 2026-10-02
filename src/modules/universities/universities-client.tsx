'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { hasPermission } from '@/utils';
import { clientUniversityServices } from '@/apis/services/universities/client';
import { UniversitiesFilters } from './universities-filters';
import { UniversityDeleteModal } from './universities-modal/university-delete-modal';
import { UniversityFormModal } from './universities-modal/university-form-modal';
import { UniversitiesTable } from './universities-table';
import type { CreateUniversityDto, UpdateUniversityDto } from '@/apis/services/universities/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IUniversity } from '@/models';

interface UniversitiesClientProps {
  initialData?: PaginatedResult<IUniversity>;
}

export const UniversitiesClient = ({ initialData }: UniversitiesClientProps) => {
  const t = useTranslations('universities');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'universities:create');
  const canUpdate = hasPermission(user, 'universities:update');
  const canDelete = hasPermission(user, 'universities:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedUniversity, setSelectedUniversity] = useState<IUniversity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.universities.list({ page, search }),
    requestFn: () =>
      clientUniversityServices.getUniversities({
        page,
        search: search || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateUniversityDto | UpdateUniversityDto) => {
      if (selectedUniversity) {
        return clientUniversityServices.updateUniversity(selectedUniversity.id, payload);
      }
      return clientUniversityServices.createUniversity(payload as CreateUniversityDto);
    },
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(selectedUniversity ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.universities.lists });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientUniversityServices.deleteUniversity(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.universities.lists });
    },
  });

  const handleCreateClick = () => {
    setSelectedUniversity(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (university: IUniversity) => {
    setSelectedUniversity(university);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (university: IUniversity) => {
    setSelectedUniversity(university);
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

      <UniversitiesFilters
        search={search}
        onSearchChange={handleSearchChange}
        onCreateClick={canCreate ? handleCreateClick : undefined}
      />

      <UniversitiesTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      <UniversityFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
        university={selectedUniversity}
        isPending={isSaving}
      />

      <UniversityDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedUniversity) {
            await deleteMutate(selectedUniversity.id);
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
};
