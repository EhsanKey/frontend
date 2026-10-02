import { Suspense } from 'react';
import { serverResourceServices } from '@/apis/services/resources/server';
import { ResourcesClient } from './resources-client';
import type { ResourceKind, ResourceStatus } from '@/models';

interface ResourcesModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    kind?: string;
  }>;
}

export const ResourcesModule = async ({
  searchParams,
}: ResourcesModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const status = resolvedParams?.status as ResourceStatus | undefined;
  const kind = resolvedParams?.kind as ResourceKind | undefined;

  let initialData = undefined;
  try {
    initialData = await serverResourceServices.getResources({
      page,
      q: search,
      status: status !== ('all' as ResourceStatus) ? status : undefined,
      resourceKind: kind !== ('all' as ResourceKind) ? kind : undefined,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <ResourcesClient initialData={initialData} />
    </Suspense>
  );
};

export default ResourcesModule;
