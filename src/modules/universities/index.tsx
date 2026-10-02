import { Suspense } from 'react';
import { serverUniversityServices } from '@/apis/services/universities/server';
import { UniversitiesClient } from './universities-client';

interface UniversitiesModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const UniversitiesModule = async ({ searchParams }: UniversitiesModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverUniversityServices.getUniversities({
      page,
      search,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <UniversitiesClient initialData={initialData} />
    </Suspense>
  );
};

export default UniversitiesModule;
