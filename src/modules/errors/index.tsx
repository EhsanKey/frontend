import { Suspense } from 'react';
import { serverErrorServices } from '@/apis/services/errors/server';
import { ErrorsClient } from './errors-client';
import type { ErrorLevel, ErrorSource } from '@/models';

interface ErrorsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    source?: string;
    level?: string;
    isResolved?: string;
  }>;
}

export const ErrorsModule = async ({ searchParams }: ErrorsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const source = resolvedParams?.source as ErrorSource | undefined;
  const level = resolvedParams?.level as ErrorLevel | undefined;
  const isResolvedStr = resolvedParams?.isResolved;
  const isResolved =
    isResolvedStr === 'all' || isResolvedStr === undefined
      ? undefined
      : isResolvedStr === 'true';

  let initialData = undefined;
  try {
    initialData = await serverErrorServices.getErrors({
      page,
      search,
      source: source !== ('all' as ErrorSource) ? source : undefined,
      level: level !== ('all' as ErrorLevel) ? level : undefined,
      isResolved,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <ErrorsClient initialData={initialData} />
    </Suspense>
  );
};

export default ErrorsModule;
