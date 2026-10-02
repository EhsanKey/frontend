import { Suspense } from 'react';
import { serverMajorServices } from '@/apis/services/majors/server';
import { MajorsClient } from './majors-client';

interface MajorsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const MajorsModule = async ({ searchParams }: MajorsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverMajorServices.getMajors({
      page,
      search,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <MajorsClient initialData={initialData} />
    </Suspense>
  );
};

export default MajorsModule;
