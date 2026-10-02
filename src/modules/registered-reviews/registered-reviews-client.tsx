'use client';

import { Button, toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS, QUERY_KEYS, ROUTES } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientRegisteredReviewServices } from '@/apis/services/registered-reviews/client';
import { hasPermission } from '@/utils';
import { RegisteredReviewsFilters } from './registered-reviews-filters';
import { ReviewDeleteModal } from './registered-reviews-modal/review-delete-modal';
import { ReviewEditModal } from './registered-reviews-modal/review-edit-modal';
import { RegisteredReviewsTable } from './registered-reviews-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { DegreeLevel, IRegisteredReview, ReviewSource } from '@/models';

interface RegisteredReviewsClientProps {
  initialData?: PaginatedResult<IRegisteredReview>;
}

export const RegisteredReviewsClient = ({ initialData }: RegisteredReviewsClientProps) => {
  const t = useTranslations('registeredReviews');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canUpdate =
    hasPermission(user, 'reviews:update') || hasPermission(user, 'reviews:manage');
  const canDelete =
    hasPermission(user, 'reviews:delete') || hasPermission(user, 'reviews:manage');

  // URL Query Params state
  const page = Number(getQuery('page')) || 1;
  const search = getQuery('search') ?? '';
  const universityId = getQuery('universityId') ?? undefined;
  const campusId = getQuery('campusId') ?? undefined;
  const majorId = getQuery('majorId') ?? undefined;
  const professorId = getQuery('professorId') ?? undefined;
  const courseId = getQuery('courseId') ?? undefined;
  const degreeLevel = (getQuery('degreeLevel') as DegreeLevel) ?? undefined;
  const source = (getQuery('source') as ReviewSource | 'all') ?? undefined;
  const semester = getQuery('semester') ?? undefined;

  // Modals state
  const [selectedReview, setSelectedReview] = useState<IRegisteredReview | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.registeredReviews.list({
      page,
      search,
      universityId,
      campusId,
      majorId,
      professorId,
      courseId,
      degreeLevel,
      source,
      semester,
    }),
    requestFn: () =>
      clientRegisteredReviewServices.getRegisteredReviews({
        page,
        q: search || undefined,
        universityId: universityId || undefined,
        campusId: campusId || undefined,
        majorId: majorId || undefined,
        professorId: professorId || undefined,
        courseId: courseId || undefined,
        degreeLevel: degreeLevel || undefined,
        source: source && source !== 'all' ? source : undefined,
        semester: semester || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: updateMutate, isPending: isUpdating } = usePostRequest({
    requestFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { content: string; teachingId?: string; semester?: string | null };
    }) => clientRegisteredReviewServices.updateRegisteredReview(id, payload),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.updated'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.registeredReviews.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientRegisteredReviewServices.deleteRegisteredReview(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.registeredReviews.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  // Handlers
  const handlePageChange = (newPage: number) => {
    updateQueries({ page: String(newPage) });
  };

  const handleSearchChange = (val: string) => {
    updateQueries({ search: val || undefined, page: '1' });
  };

  const handleUniversityChange = (val: string) => {
    updateQueries({ universityId: val || undefined, campusId: undefined, page: '1' });
  };

  const handleCampusChange = (val: string) => {
    updateQueries({ campusId: val || undefined, page: '1' });
  };

  const handleMajorChange = (val: string) => {
    updateQueries({ majorId: val || undefined, page: '1' });
  };

  const handleProfessorChange = (val: string) => {
    updateQueries({ professorId: val || undefined, page: '1' });
  };

  const handleCourseChange = (val: string) => {
    updateQueries({ courseId: val || undefined, page: '1' });
  };

  const handleDegreeLevelChange = (val: string) => {
    updateQueries({ degreeLevel: val || undefined, page: '1' });
  };

  const handleSourceChange = (val: string) => {
    updateQueries({ source: val || undefined, page: '1' });
  };

  const handleSemesterChange = (val: string) => {
    updateQueries({ semester: val || undefined, page: '1' });
  };

  const handleClearFilters = () => {
    updateQueries({
      search: undefined,
      universityId: undefined,
      campusId: undefined,
      majorId: undefined,
      professorId: undefined,
      courseId: undefined,
      degreeLevel: undefined,
      source: undefined,
      semester: undefined,
      page: '1',
    });
  };

  const handleEditClick = (review: IRegisteredReview) => {
    setSelectedReview(review);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (review: IRegisteredReview) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleEditSubmit = async (payload: { content: string; teachingId?: string; semester?: string | null }) => {
    if (!selectedReview) return;
    await updateMutate({ id: selectedReview.id, payload });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    await deleteMutate(selectedReview.id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header with Quick Navigation Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-title-md font-bold text-neutral-900">
            <MessageSquareQuote className="w-7 h-7 text-primary-600" />
            {t('title')}
          </h1>
          <p className="mt-1 text-body-sm text-neutral-600">
            {t('description')}
          </p>
        </div>

        {/* Link to Submissions Moderation Queue */}
        <Link href={ROUTES.reviews}>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-primary-200 bg-primary-50/40 text-primary-700 hover:bg-primary-50 font-medium"
          >
            <Clock className={ICON_SIZE_CLASS.sm} />
            {t('banner.moderationQueueLink')}
            <ArrowLeft className={ICON_SIZE_CLASS.sm} />
          </Button>
        </Link>
      </div>

      {/* Advanced Filters Bar */}
      <RegisteredReviewsFilters
        search={search}
        universityId={universityId}
        campusId={campusId}
        majorId={majorId}
        professorId={professorId}
        courseId={courseId}
        degreeLevel={degreeLevel}
        source={source}
        semester={semester}
        onSearchChange={handleSearchChange}
        onUniversityChange={handleUniversityChange}
        onCampusChange={handleCampusChange}
        onMajorChange={handleMajorChange}
        onProfessorChange={handleProfessorChange}
        onCourseChange={handleCourseChange}
        onDegreeLevelChange={handleDegreeLevelChange}
        onSourceChange={handleSourceChange}
        onSemesterChange={handleSemesterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Table */}
      <RegisteredReviewsTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      {/* Edit Modal */}
      <ReviewEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
        onSubmit={handleEditSubmit}
        isPending={isUpdating}
      />

      {/* Delete Modal */}
      <ReviewDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
};
