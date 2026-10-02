'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientResourceServices } from '@/apis/services/resources/client';
import { hasPermission } from '@/utils';
import { ResourcesFilters } from './resources-filters';
import { ResourceDeleteModal } from './resources-modal/resource-delete-modal';
import { ResourceRejectModal } from './resources-modal/resource-reject-modal';
import { ResourcesTable } from './resources-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IResourceSubmission, ResourceKind, ResourceStatus } from '@/models';

interface ResourcesClientProps {
  initialData?: PaginatedResult<IResourceSubmission>;
}

export const ResourcesClient = ({ initialData }: ResourcesClientProps) => {
  const router = useRouter();
  const t = useTranslations('resources');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canApprove = hasPermission(user, 'resources:status');
  const canUpdate = hasPermission(user, 'resources:update');
  const canDelete = hasPermission(user, 'resources:delete');

  const search = getQuery('search') ?? '';
  const status = (getQuery('status') as ResourceStatus | 'all') ?? 'all';
  const resourceKind = (getQuery('kind') as ResourceKind | 'all') ?? 'all';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedResource, setSelectedResource] = useState<IResourceSubmission | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.resources.list({ page, search, status, resourceKind }),
    requestFn: () =>
      clientResourceServices.getResources({
        page,
        q: search || undefined,
        status: status !== 'all' ? status : undefined,
        resourceKind: resourceKind !== 'all' ? resourceKind : undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: approveMutate, isPending: isApproving } = usePostRequest({
    requestFn: (id: string) => clientResourceServices.approveResource(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.approved'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: rejectMutate, isPending: isRejecting } = usePostRequest({
    requestFn: ({ id, reason }: { id: string; reason: string }) =>
      clientResourceServices.rejectResource(id, { reason }),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.rejected'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientResourceServices.deleteResource(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const handleApprove = async (resource: IResourceSubmission) => {
    await approveMutate(resource.id);
  };

  const handleRejectClick = (resource: IResourceSubmission) => {
    setSelectedResource(resource);
    setIsRejectOpen(true);
  };

  const handleEditClick = (resource: IResourceSubmission) => {
    router.push(`/dashboard/resources/${resource.id}`);
  };

  const handleDeleteClick = (resource: IResourceSubmission) => {
    setSelectedResource(resource);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Filters Toolbar */}
      <ResourcesFilters
        search={search}
        status={status}
        resourceKind={resourceKind}
        onSearchChange={(val) => {
          updateQueries({ search: val || null, page: null });
        }}
        onStatusChange={(val) => {
          updateQueries({ status: val === 'all' ? null : val, page: null });
        }}
        onKindChange={(val) => {
          updateQueries({ kind: val === 'all' ? null : val, page: null });
        }}
      />

      {/* Table */}
      <ResourcesTable
        data={data}
        isLoading={isLoading || isApproving}
        onPageChange={(newPage) => {
          updateQueries({ page: newPage === 1 ? null : newPage });
        }}
        onApprove={canApprove ? handleApprove : undefined}
        onReject={canApprove ? handleRejectClick : undefined}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      {/* Modals */}
      <ResourceRejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        resource={selectedResource}
        isPending={isRejecting}
        onSubmit={async (reason) => {
          if (selectedResource) {
            await rejectMutate({ id: selectedResource.id, reason });
          }
        }}
      />

      <ResourceDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        isPending={isDeleting}
        onConfirm={async () => {
          if (selectedResource) {
            await deleteMutate(selectedResource.id);
          }
        }}
      />
    </div>
  );
};
