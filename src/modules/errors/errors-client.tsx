'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientErrorServices } from '@/apis/services/errors/client';
import { hasPermission } from '@/utils';
import { ErrorsFilters } from './errors-filters';
import { ErrorDetailsModal } from './errors-modal/error-details-modal';
import { ErrorsTable } from './errors-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ErrorLevel, ErrorSource, IErrorLog } from '@/models';

interface ErrorsClientProps {
  initialData?: PaginatedResult<IErrorLog>;
}

export const ErrorsClient = ({ initialData }: ErrorsClientProps) => {
  const t = useTranslations('errors');
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { getQuery, updateQueries } = useQueryState();

  const canResolve = hasPermission(user, 'errors:resolve');

  const search = getQuery('search') ?? '';
  const source = (getQuery('source') as ErrorSource | 'all') ?? 'all';
  const level = (getQuery('level') as ErrorLevel | 'all') ?? 'all';
  const isResolved = (getQuery('isResolved') as 'all' | 'true' | 'false') ?? 'all';
  const page = Number(getQuery('page')) || 1;

  // Modal state
  const [selectedError, setSelectedError] = useState<IErrorLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.errors.list({ page, search, source, level, isResolved }),
    requestFn: () =>
      clientErrorServices.getErrors({
        page,
        search: search || undefined,
        source: source !== 'all' ? source : undefined,
        level: level !== 'all' ? level : undefined,
        isResolved: isResolved === 'all' ? undefined : isResolved === 'true',
      }),
    initialData,
  });

  // Resolve mutation
  const { mutateAsync: resolveMutate, isPending: isResolving } = usePostRequest({
    requestFn: (id: string) => clientErrorServices.resolveError(id),
    onSuccess: () => {
      toast.success(t('toast.resolved'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.errors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const handleViewDetails = (error: IErrorLog) => {
    setSelectedError(error);
    setIsDetailsOpen(true);
  };

  const handleResolve = async (error: IErrorLog) => {
    await resolveMutate(error.id);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Filters Toolbar */}
      <ErrorsFilters
        search={search}
        source={source}
        level={level}
        isResolved={isResolved}
        onSearchChange={(val) => {
          updateQueries({ search: val || null, page: null });
        }}
        onSourceChange={(val) => {
          updateQueries({ source: val === 'all' ? null : val, page: null });
        }}
        onLevelChange={(val) => {
          updateQueries({ level: val === 'all' ? null : val, page: null });
        }}
        onResolvedChange={(val) => {
          updateQueries({ isResolved: val === 'all' ? null : val, page: null });
        }}
      />

      {/* Table */}
      <ErrorsTable
        data={data}
        isLoading={isLoading || isResolving}
        onPageChange={(newPage) => {
          updateQueries({ page: newPage === 1 ? null : newPage });
        }}
        onViewDetails={handleViewDetails}
        onResolve={canResolve ? handleResolve : undefined}
      />

      {/* Details Modal */}
      <ErrorDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        error={selectedError}
        isResolving={isResolving}
        onResolve={
          canResolve
            ? async (id) => {
                await resolveMutate(id);
              }
            : undefined
        }
      />
    </div>
  );
};
