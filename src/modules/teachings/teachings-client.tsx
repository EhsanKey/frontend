'use client';

import { toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientCampusServices } from '@/apis/services/campuses/client';
import { clientCourseServices } from '@/apis/services/courses/client';
import { clientMajorServices } from '@/apis/services/majors/client';
import { clientProfessorServices } from '@/apis/services/professors/client';
import { clientTeachingServices } from '@/apis/services/teachings/client';
import { hasPermission } from '@/utils';
import { TeachingsFilters } from './teachings-filters';
import { TeachingDeleteModal } from './teachings-modal/teaching-delete-modal';
import { TeachingFormModal } from './teachings-modal/teaching-form-modal';
import { TeachingsTable } from './teachings-table';
import type { CreateTeachingDto, UpdateTeachingDto } from '@/apis/services/teachings/_dto';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { DegreeLevel, ICampus, ICourse, IMajor, IProfessor, ITeaching } from '@/models';

interface TeachingsClientProps {
  initialData?: PaginatedResult<ITeaching>;
  initialProfessors?: IProfessor[];
  initialCourses?: ICourse[];
  initialCampuses?: ICampus[];
  initialMajors?: IMajor[];
}

export const TeachingsClient = ({
  initialData,
  initialProfessors = [],
  initialCourses = [],
  initialCampuses = [],
  initialMajors = [],
}: TeachingsClientProps) => {
  const t = useTranslations('teachings');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'teachings:create');
  const canUpdate = hasPermission(user, 'teachings:update');
  const canDelete = hasPermission(user, 'teachings:delete');

  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;
  const professorId = getQuery('professorId') ?? '';
  const courseId = getQuery('courseId') ?? '';
  const degreeLevel = (getQuery('degreeLevel') as DegreeLevel | '') || '';

  // Modals state
  const [selectedTeaching, setSelectedTeaching] = useState<ITeaching | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries for related entities
  const { data: profsData } = useGetRequest({
    queryKey: QUERY_KEYS.professors.list({ pageSize: 100 }),
    requestFn: () => clientProfessorServices.getProfessors({ pageSize: 100 }),
    initialData:
      initialProfessors.length > 0
        ? {
            items: initialProfessors,
            meta: {
              total: initialProfessors.length,
              page: 1,
              perPage: 100,
              pageSize: 100,
              totalPages: 1,
            },
          }
        : undefined,
  });
  const professors = profsData?.items || initialProfessors;

  const { data: coursesData } = useGetRequest({
    queryKey: QUERY_KEYS.courses.list({ pageSize: 100 }),
    requestFn: () => clientCourseServices.getCourses({ pageSize: 100 }),
    initialData:
      initialCourses.length > 0
        ? {
            items: initialCourses,
            meta: {
              total: initialCourses.length,
              page: 1,
              perPage: 100,
              pageSize: 100,
              totalPages: 1,
            },
          }
        : undefined,
  });
  const courses = coursesData?.items || initialCourses;

  const { data: campusesData } = useGetRequest({
    queryKey: QUERY_KEYS.campuses.list({ pageSize: 100 }),
    requestFn: () => clientCampusServices.getCampuses({ pageSize: 100 }),
    initialData:
      initialCampuses.length > 0
        ? {
            items: initialCampuses,
            meta: {
              total: initialCampuses.length,
              page: 1,
              perPage: 100,
              pageSize: 100,
              totalPages: 1,
            },
          }
        : undefined,
  });
  const campuses = campusesData?.items || initialCampuses;

  const { data: majorsData } = useGetRequest({
    queryKey: QUERY_KEYS.majors.list({ pageSize: 100 }),
    requestFn: () => clientMajorServices.getMajors({ pageSize: 100 }),
    initialData:
      initialMajors.length > 0
        ? {
            items: initialMajors,
            meta: {
              total: initialMajors.length,
              page: 1,
              perPage: 100,
              pageSize: 100,
              totalPages: 1,
            },
          }
        : undefined,
  });
  const majors = majorsData?.items || initialMajors;

  // Teachings Query
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.teachings.list({
      page,
      search,
      professorId,
      courseId,
      degreeLevel,
    }),
    requestFn: () =>
      clientTeachingServices.getTeachings({
        page,
        search: search || undefined,
        professorId: professorId || undefined,
        courseId: courseId || undefined,
        degreeLevel: (degreeLevel as DegreeLevel) || undefined,
      }),
    initialData,
  });

  // Mutations
  const { mutateAsync: saveMutate, isPending: isSaving } = usePostRequest({
    requestFn: (payload: CreateTeachingDto | UpdateTeachingDto) => {
      if (selectedTeaching) {
        return clientTeachingServices.updateTeaching(selectedTeaching.id, payload);
      }
      return clientTeachingServices.createTeaching(payload as CreateTeachingDto);
    },
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(selectedTeaching ? t('toast.updated') : t('toast.created'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teachings.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.professors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.lists });
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = usePostRequest({
    requestFn: (id: string) => clientTeachingServices.deleteTeaching(id),
    showSuccessToast: false,
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teachings.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.professors.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.lists });
    },
  });

  const handleCreateClick = () => {
    setSelectedTeaching(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (teaching: ITeaching) => {
    setSelectedTeaching(teaching);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (teaching: ITeaching) => {
    setSelectedTeaching(teaching);
    setIsDeleteOpen(true);
  };

  const handleSearchChange = (value: string) => {
    updateQueries({ search: value || null, page: null });
  };

  const handleProfessorChange = (value: string) => {
    updateQueries({ professorId: value || null, page: null });
  };

  const handleCourseChange = (value: string) => {
    updateQueries({ courseId: value || null, page: null });
  };

  const handleDegreeLevelChange = (value: string) => {
    updateQueries({ degreeLevel: value || null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateQueries({ page: newPage > 1 ? String(newPage) : null });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      <TeachingsFilters
        search={search}
        professorId={professorId}
        courseId={courseId}
        degreeLevel={degreeLevel}
        professors={professors}
        courses={courses}
        onSearchChange={handleSearchChange}
        onProfessorChange={handleProfessorChange}
        onCourseChange={handleCourseChange}
        onDegreeLevelChange={handleDegreeLevelChange}
        onCreateClick={canCreate ? handleCreateClick : undefined}
      />

      <TeachingsTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={canUpdate ? handleEditClick : undefined}
        onDelete={canDelete ? handleDeleteClick : undefined}
      />

      <TeachingFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (values) => {
          await saveMutate(values);
        }}
        teaching={selectedTeaching}
        professors={professors}
        courses={courses}
        campuses={campuses}
        majors={majors}
        isPending={isSaving}
      />

      <TeachingDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedTeaching) {
            await deleteMutate(selectedTeaching.id);
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
};
