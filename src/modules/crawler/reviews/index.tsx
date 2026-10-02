import { Suspense } from 'react';
import { serverCrawlerServices } from '@/apis/services/crawler/server';
import { CrawlerReviewsClient } from './reviews-client';
import type { CrawlerMessageStatus } from '@/apis/services/crawler';

export interface CrawlerReviewsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    trackedChannelId?: string;
    universityId?: string;
    campusId?: string;
    majorId?: string;
  }>;
}

export const CrawlerReviewsModule = async ({
  searchParams,
}: CrawlerReviewsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const status = (resolvedParams?.status as CrawlerMessageStatus | 'all') ?? undefined;
  const trackedChannelId = resolvedParams?.trackedChannelId ?? undefined;
  const universityId = resolvedParams?.universityId ?? undefined;
  const campusId = resolvedParams?.campusId ?? undefined;
  const majorId = resolvedParams?.majorId ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverCrawlerServices.getCrawlerMessages({
      page,
      pageSize: 15,
      search: search || undefined,
      status: status && status !== 'all' ? status : undefined,
      trackedChannelId: trackedChannelId || undefined,
      universityId: universityId || undefined,
      campusId: campusId || undefined,
      majorId: majorId || undefined,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <CrawlerReviewsClient initialData={initialData} />
    </Suspense>
  );
};

export default CrawlerReviewsModule;
export * from './types';
