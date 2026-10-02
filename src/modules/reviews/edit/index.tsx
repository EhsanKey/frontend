import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { serverReviewServices } from '@/apis/services/reviews/server';
import { ReviewEditClient } from './review-edit-client';
import { ReviewEditFallback } from './skeleton/review-edit-fallback';

interface ReviewEditModuleProps {
  id: string;
}

export const ReviewEditModule = async ({ id }: ReviewEditModuleProps) => {
  await connection();

  let review = null;
  try {
    review = await serverReviewServices.getReviewById(id);
  } catch {
    notFound();
  }

  if (!review) {
    notFound();
  }

  return (
    <Suspense fallback={<ReviewEditFallback />}>
      <ReviewEditClient review={review} />
    </Suspense>
  );
};

export default ReviewEditModule;
