'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientCourseServices } from '@/apis/services/courses/client';
import { hasPermission } from '@/utils';
import { CoursesFilters } from './courses-filters';
import { CourseDeleteModal } from './courses-modal/course-delete-modal';
import { CourseFormModal } from './courses-modal/course-form-modal';
import { CourseMergeModal } from './courses-modal/course-merge-modal';
import { CoursesTable } from './courses-table';
import type { CreateCourseDto, UpdateCourseDto } from '@/apis/services/courses/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICourse } from '@/models';

interface CoursesClientProps {
  initialData?: PaginatedResult<ICourse>;
}

export const CoursesClient = ({ initialData }: CoursesClientProps) => {
  const t = useTranslations('courses');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'courses:create');
  const canMerge = hasPermission(user, 'courses:merge');
  const canUpdate = hasPermission(user, 'courses:update');
  const canDelete = hasPermission(user, 'courses:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.courses.list({ page, search }),
    requestFn: () =>
      clientCourseServices.getCourses({
        page,
        search: search || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateCourseDto | UpdateCourseDto) => {
      if (selectedCourse) {
        return clientCourseServices.updateCourse(selectedCourse.id, payload);
      }
      return clientCourseServices.createCourse(payload as CreateCourseDto);
    },
    onSuccess: () => {
      toast.success(selectedCourse ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientCourseServices.deleteCourse(id),
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const { mutateAsync: mergeMutate, isPending: isMerging } = usePostRequest({
    requestFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      clientCourseServices.mergeCourses(sourceId, targetId),
    onSuccess: () => {
      toast.success(t('toast.merged'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
  });

  const handleCreateClick = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleMergeClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsMergeOpen(true);
  };

  const handleDeleteClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Filters Toolbar */}
      <CoursesFilters
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
      <CoursesTable
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
      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={selectedCourse}
        isPending={isSaving}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
      />

      {/* Merge Modal */}
      <CourseMergeModal
        isOpen={isMergeOpen}
        onClose={() => setIsMergeOpen(false)}
        sourceCourse={selectedCourse}
        coursesList={data?.items ?? []}
        isPending={isMerging}
        onSubmit={async (targetId) => {
          if (selectedCourse) {
            await mergeMutate({ sourceId: selectedCourse.id, targetId });
          }
        }}
      />

      {/* Delete Modal */}
      <CourseDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        isPending={isDeleting}
        onConfirm={async () => {
          if (selectedCourse) {
            await deleteMutate(selectedCourse.id);
          }
        }}
      />
    </div>
  );
};
