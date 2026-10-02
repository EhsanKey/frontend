import { Suspense } from 'react';
import { serverProfessorServices } from '@/apis/services/professors/server';
import { ProfessorsClient } from './professors-client';

interface ProfessorsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const ProfessorsModule = async ({
  searchParams,
}: ProfessorsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverProfessorServices.getProfessors({
      page,
      search,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <ProfessorsClient initialData={initialData} />
    </Suspense>
  );
};

export default ProfessorsModule;
