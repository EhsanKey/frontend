'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientProfessorServices } from '@/apis/services/professors/client';
import { hasPermission } from '@/utils';
import { ProfessorsFilters } from './professors-filters';
import { ProfessorDeleteModal } from './professors-modal/professor-delete-modal';
import { ProfessorFormModal } from './professors-modal/professor-form-modal';
import { ProfessorMergeModal } from './professors-modal/professor-merge-modal';
import { ProfessorsTable } from './professors-table';
import type { CreateProfessorDto, UpdateProfessorDto } from '@/apis/services/professors/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IProfessor } from '@/models';

interface ProfessorsClientProps {
  initialData?: PaginatedResult<IProfessor>;
}

export const ProfessorsClient = ({ initialData }: ProfessorsClientProps) => {
  const t = useTranslations('professors');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'professors:create');
  const canMerge = hasPermission(user, 'professors:merge');
  const canUpdate = hasPermission(user, 'professors:update');
  const canDelete = hasPermission(user, 'professors:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.professors.list({ page, search }),
    requestFn: () =>
      clientProfessorServices.getProfessors({
        page,
        search: search || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateProfessorDto | UpdateProfessorDto) => {
      if (selectedProfessor) {
        return clientProfessorServices.updateProfessor(selectedProfessor.id, payload);
      }
      return clientProfessorServices.createProfessor(payload as CreateProfessorDto);
    },
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(selectedProfessor ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.professors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientProfessorServices.deleteProfessor(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.professors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: mergeMutate, isPending: isMerging } = usePostRequest({
    requestFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      clientProfessorServices.mergeProfessors(sourceId, targetId),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.merged'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.professors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const handleCreateClick = () => {
    setSelectedProfessor(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (professor: IProfessor) => {
    setSelectedProfessor(professor);
    setIsFormOpen(true);
  };

  const handleMergeClick = (professor: IProfessor) => {
    setSelectedProfessor(professor);
    setIsMergeOpen(true);
  };

  const handleDeleteClick = (professor: IProfessor) => {
    setSelectedProfessor(professor);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Filters Toolbar */}
      <ProfessorsFilters
        search={search}
        onSearchChange={(val) => {
          updateQueries({
            search: val || null,
            page: null,
          });
        }}
        onCreateClick={canCreate ? handleCreateClick : undefined}
      />

      {/* Table */}
      <ProfessorsTable
        data={data}
        isLoading={isLoading}
        onPageChange={(newPage) => {
          updateQueries({
            page: newPage === 1 ? null : newPage,
          });
        }}
        onEdit={canUpdate ? handleEditClick : undefined}
        onMerge={canMerge ? handleMergeClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      {/* Create / Edit Modal */}
      <ProfessorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        professor={selectedProfessor}
        isPending={isSaving}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
      />

      {/* Merge Modal */}
      <ProfessorMergeModal
        isOpen={isMergeOpen}
        onClose={() => setIsMergeOpen(false)}
        sourceProfessor={selectedProfessor}
        professorsList={data?.items ?? []}
        isPending={isMerging}
        onSubmit={async (targetId) => {
          if (selectedProfessor) {
            await mergeMutate({ sourceId: selectedProfessor.id, targetId });
          }
        }}
      />

      {/* Delete Modal */}
      <ProfessorDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        isPending={isDeleting}
        onConfirm={async () => {
          if (selectedProfessor) {
            await deleteMutate(selectedProfessor.id);
          }
        }}
      />
    </div>
  );
};
