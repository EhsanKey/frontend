import { Suspense } from 'react';
import { serverReviewServices } from '@/apis/services/reviews/server';
import { ReviewsClient } from './reviews-client';
import type { ReviewStatus } from '@/models';

interface ReviewsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export const ReviewsModule = async ({ searchParams }: ReviewsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const status = resolvedParams?.status as ReviewStatus | undefined;

  let initialData = undefined;
  try {
    initialData = await serverReviewServices.getReviews({
      page,
      q: search,
      status: status !== ('all' as ReviewStatus) ? status : undefined,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <ReviewsClient initialData={initialData} />
    </Suspense>
  );
};

export default ReviewsModule;
