import { Suspense } from 'react';
import { serverCampusServices } from '@/apis/services/campuses/server';
import { serverUniversityServices } from '@/apis/services/universities/server';
import { CampusesClient } from './campuses-client';

interface CampusesModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    universityId?: string;
  }>;
}

export const CampusesModule = async ({ searchParams }: CampusesModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const universityId = resolvedParams?.universityId ?? undefined;

  let initialData = undefined;
  let initialUniversities = undefined;

  try {
    const [campusesRes, universitiesRes] = await Promise.allSettled([
      serverCampusServices.getCampuses({
        page,
        search,
        universityId,
      }),
      serverUniversityServices.getUniversities({ pageSize: 100 }),
    ]);

    if (campusesRes.status === 'fulfilled') {
      initialData = campusesRes.value;
    }
    if (universitiesRes.status === 'fulfilled') {
      initialUniversities = universitiesRes.value.items;
    }
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <CampusesClient
        initialData={initialData}
        initialUniversities={initialUniversities}
      />
    </Suspense>
  );
};

export default CampusesModule;
