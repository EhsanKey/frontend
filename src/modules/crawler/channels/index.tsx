import { Suspense } from 'react';
import { serverCrawlerServices } from '@/apis/services/crawler/server';
import { CrawlerChannelsClient } from './channels-client';
import type { TrackedChannelStatus } from '@/apis/services/crawler';

export interface CrawlerChannelsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    universityId?: string;
    campusId?: string;
    majorId?: string;
  }>;
}

export const CrawlerChannelsModule = async ({
  searchParams,
}: CrawlerChannelsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const status = (resolvedParams?.status as TrackedChannelStatus | 'all') ?? undefined;
  const universityId = resolvedParams?.universityId ?? undefined;
  const campusId = resolvedParams?.campusId ?? undefined;
  const majorId = resolvedParams?.majorId ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverCrawlerServices.getTrackedChannels({
      page,
      pageSize: 15,
      search: search || undefined,
      status: status && status !== 'all' ? status : undefined,
      universityId: universityId || undefined,
      campusId: campusId || undefined,
      majorId: majorId || undefined,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <CrawlerChannelsClient initialData={initialData} />
    </Suspense>
  );
};

export default CrawlerChannelsModule;
export * from './types';
