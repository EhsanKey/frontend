'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { hasPermission } from '@/utils';
import { clientCampusServices } from '@/apis/services/campuses/client';
import { clientUniversityServices } from '@/apis/services/universities/client';
import { CampusesFilters } from './campuses-filters';
import { CampusDeleteModal } from './campuses-modal/campus-delete-modal';
import { CampusFormModal } from './campuses-modal/campus-form-modal';
import { CampusesTable } from './campuses-table';
import type { CreateCampusDto, UpdateCampusDto } from '@/apis/services/campuses/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICampus, IUniversity } from '@/models';

interface CampusesClientProps {
  initialData?: PaginatedResult<ICampus>;
  initialUniversities?: IUniversity[];
}

export const CampusesClient = ({
  initialData,
  initialUniversities = [],
}: CampusesClientProps) => {
  const t = useTranslations('campuses');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'campuses:create');
  const canUpdate = hasPermission(user, 'campuses:update');
  const canDelete = hasPermission(user, 'campuses:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;
  const universityId = getQuery('universityId') ?? '';

  // Modals state
  const [selectedCampus, setSelectedCampus] = useState<ICampus | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Universities list query for filters & form
  const { data: universitiesData } = useGetRequest({
    queryKey: QUERY_KEYS.universities.list({ pageSize: 100 }),
    requestFn: () => clientUniversityServices.getUniversities({ pageSize: 100 }),
    initialData:
      initialUniversities.length > 0
        ? {
            items: initialUniversities,
            meta: {
              total: initialUniversities.length,
              page: 1,
              perPage: 100,
              pageSize: 100,
              totalPages: 1,
            },
          }
        : undefined,
  });

  const universities = universitiesData?.items || initialUniversities;

  // Campuses Query
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.campuses.list({ page, search, universityId }),
    requestFn: () =>
      clientCampusServices.getCampuses({
        page,
        search: search || undefined,
        universityId: universityId || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateCampusDto | UpdateCampusDto) => {
      if (selectedCampus) {
        return clientCampusServices.updateCampus(selectedCampus.id, payload);
      }
      return clientCampusServices.createCampus(payload as CreateCampusDto);
    },
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(selectedCampus ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campuses.lists });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientCampusServices.deleteCampus(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campuses.lists });
    },
  });

  const handleCreateClick = () => {
    setSelectedCampus(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (campus: ICampus) => {
    setSelectedCampus(campus);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (campus: ICampus) => {
    setSelectedCampus(campus);
    setIsDeleteOpen(true);
  };

  const handleSearchChange = (value: string) => {
    updateQueries({ search: value || null, page: null });
  };

  const handleUniversityChange = (value: string) => {
    updateQueries({ universityId: value || null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateQueries({ page: newPage > 1 ? String(newPage) : null });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      <CampusesFilters
        search={search}
        universityId={universityId}
        universities={universities}
        onSearchChange={handleSearchChange}
        onUniversityChange={handleUniversityChange}
        onCreateClick={canCreate ? handleCreateClick : undefined}
      />

      <CampusesTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      <CampusFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
        campus={selectedCampus}
        universities={universities}
        isPending={isSaving}
      />

      <CampusDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedCampus) {
            await deleteMutate(selectedCampus.id);
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
};
