'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientReviewServices } from '@/apis/services/reviews/client';
import { hasPermission } from '@/utils';
import { ReviewsFilters } from './reviews-filters';
import { ReviewDeleteModal } from './reviews-modal/review-delete-modal';
import { ReviewRejectModal } from './reviews-modal/review-reject-modal';
import { ReviewsTable } from './reviews-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IReviewSubmission, ReviewStatus } from '@/models';

interface ReviewsClientProps {
  initialData?: PaginatedResult<IReviewSubmission>;
}

export const ReviewsClient = ({ initialData }: ReviewsClientProps) => {
  const router = useRouter();
  const t = useTranslations('reviews');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canApprove = hasPermission(user, 'reviews:status');
  const canUpdate = hasPermission(user, 'reviews:update');
  const canDelete = hasPermission(user, 'reviews:delete');

  const search = getQuery('search') ?? '';
  const status = (getQuery('status') as ReviewStatus | 'all') ?? 'all';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedReview, setSelectedReview] = useState<IReviewSubmission | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.reviews.list({ page, search, status }),
    requestFn: () =>
      clientReviewServices.getReviews({
        page,
        q: search || undefined,
        status: status !== 'all' ? status : undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: approveMutate, isPending: isApproving } = usePostRequest({
    requestFn: (id: string) => clientReviewServices.approveReview(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.approved'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: rejectMutate, isPending: isRejecting } = usePostRequest({
    requestFn: ({ id, reason }: { id: string; reason: string }) =>
      clientReviewServices.rejectReview(id, { reason }),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.rejected'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });


  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientReviewServices.deleteReview(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const handleApprove = async (review: IReviewSubmission) => {
    await approveMutate(review.id);
  };

  const handleRejectClick = (review: IReviewSubmission) => {
    setSelectedReview(review);
    setIsRejectOpen(true);
  };

  const handleEditClick = (review: IReviewSubmission) => {
    router.push(`/dashboard/reviews/${review.id}`);
  };

  const handleDeleteClick = (review: IReviewSubmission) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Filters Toolbar */}
      <ReviewsFilters
        search={search}
        status={status}
        onSearchChange={(val) => {
          updateQueries({
            search: val || null,
            page: null,
          });
        }}
        onStatusChange={(val) => {
          updateQueries({
            status: val === 'all' ? null : val,
            page: null,
          });
        }}
      />

      {/* Table */}
      <ReviewsTable
        data={data}
        isLoading={isLoading || isApproving}
        onPageChange={(newPage) => {
          updateQueries({
            page: newPage === 1 ? null : newPage,
          });
        }}
        onApprove={canApprove ? handleApprove : undefined}
        onReject={canApprove ? handleRejectClick : undefined}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />


      <ReviewRejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        review={selectedReview}
        isPending={isRejecting}
        onSubmit={async (reason) => {
          if (selectedReview) {
            await rejectMutate({ id: selectedReview.id, reason });
          }
        }}
      />

      <ReviewDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        isPending={isDeleting}
        onConfirm={async () => {
          if (selectedReview) {
            await deleteMutate(selectedReview.id);
          }
        }}
      />
    </div>
  );
};
