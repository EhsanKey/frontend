import { Suspense } from 'react';
import { serverCampusServices } from '@/apis/services/campuses/server';
import { serverCourseServices } from '@/apis/services/courses/server';
import { serverMajorServices } from '@/apis/services/majors/server';
import { serverProfessorServices } from '@/apis/services/professors/server';
import { serverTeachingServices } from '@/apis/services/teachings/server';
import { TeachingsClient } from './teachings-client';
import type { DegreeLevel } from '@/models';

interface TeachingsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    professorId?: string;
    courseId?: string;
    degreeLevel?: string;
  }>;
}

export const TeachingsModule = async ({ searchParams }: TeachingsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const professorId = resolvedParams?.professorId ?? undefined;
  const courseId = resolvedParams?.courseId ?? undefined;
  const degreeLevel = (resolvedParams?.degreeLevel as DegreeLevel) ?? undefined;

  let initialData = undefined;
  let initialProfessors = undefined;
  let initialCourses = undefined;
  let initialCampuses = undefined;
  let initialMajors = undefined;

  try {
    const [teachingsRes, profsRes, coursesRes, campusesRes, majorsRes] =
      await Promise.allSettled([
        serverTeachingServices.getTeachings({
          page,
          search,
          professorId,
          courseId,
          degreeLevel,
        }),
        serverProfessorServices.getProfessors({ pageSize: 100 }),
        serverCourseServices.getCourses({ pageSize: 100 }),
        serverCampusServices.getCampuses({ pageSize: 100 }),
        serverMajorServices.getMajors({ pageSize: 100 }),
      ]);

    if (teachingsRes.status === 'fulfilled') {
      initialData = teachingsRes.value;
    }
    if (profsRes.status === 'fulfilled') {
      initialProfessors = profsRes.value.items;
    }
    if (coursesRes.status === 'fulfilled') {
      initialCourses = coursesRes.value.items;
    }
    if (campusesRes.status === 'fulfilled') {
      initialCampuses = campusesRes.value.items;
    }
    if (majorsRes.status === 'fulfilled') {
      initialMajors = majorsRes.value.items;
    }
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <TeachingsClient
        initialData={initialData}
        initialProfessors={initialProfessors}
        initialCourses={initialCourses}
        initialCampuses={initialCampuses}
        initialMajors={initialMajors}
      />
    </Suspense>
  );
};

export default TeachingsModule;
