import { Suspense } from 'react';
import { serverCourseServices } from '@/apis/services/courses/server';
import { CoursesClient } from './courses-client';

interface CoursesModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const CoursesModule = async ({
  searchParams,
}: CoursesModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverCourseServices.getCourses({
      page,
      search,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <CoursesClient initialData={initialData} />
    </Suspense>
  );
};

export default CoursesModule;
