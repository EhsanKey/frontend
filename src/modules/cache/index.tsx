import { Suspense } from 'react';
import { serverAiCacheServices } from '@/apis/services/ai-cache/server';
import { CacheClient } from './cache-client';
import type { CacheModuleProps } from './types';

export const CacheModule = async ({ searchParams }: CacheModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const pageSize = Number(resolvedParams?.pageSize) || 25;
  const search = resolvedParams?.search ?? undefined;
  const intent =
    resolvedParams?.intent && resolvedParams.intent !== 'all'
      ? resolvedParams.intent
      : undefined;
  const professorId = resolvedParams?.professorId ?? undefined;
  const courseId = resolvedParams?.courseId ?? undefined;
  const sortBy = resolvedParams?.sortBy || 'lastHitAt';
  const sortOrder = resolvedParams?.sortOrder || 'desc';

  let initialEntries = undefined;
  let initialStats = undefined;

  try {
    const [entriesRes, statsRes] = await Promise.all([
      serverAiCacheServices.getCacheEntries({
        page,
        pageSize,
        search,
        intent,
        professorId,
        courseId,
        sortBy,
        sortOrder,
      }),
      serverAiCacheServices.getCacheStats(),
    ]);
    initialEntries = entriesRes;
    initialStats = statsRes;
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <CacheClient initialEntries={initialEntries} initialStats={initialStats} />
    </Suspense>
  );
};

export default CacheModule;
