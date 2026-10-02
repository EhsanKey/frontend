import { Suspense } from 'react';
import { serverBroadcastsServices } from '@/apis/services/broadcasts/server';
import { BroadcastsClient } from './broadcasts-client';

interface BroadcastsModuleProps {
  searchParams?: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

export const BroadcastsModule = async ({
  searchParams,
}: BroadcastsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const status = resolvedParams?.status;
  const search = resolvedParams?.search;

  let initialData = undefined;
  try {
    initialData = await serverBroadcastsServices.getBroadcasts({
      page,
      status,
      search,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <BroadcastsClient initialData={initialData} />
    </Suspense>
  );
};

export default BroadcastsModule;
