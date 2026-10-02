import { Suspense } from 'react';
import { serverRegisteredReviewServices } from '@/apis/services/registered-reviews/server';
import { RegisteredReviewsClient } from './registered-reviews-client';
import type { DegreeLevel, ReviewSource } from '@/models';

interface RegisteredReviewsModuleProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    universityId?: string;
    campusId?: string;
    majorId?: string;
    professorId?: string;
    courseId?: string;
    degreeLevel?: string;
    source?: string;
  }>;
}

export const RegisteredReviewsModule = async ({
  searchParams,
}: RegisteredReviewsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search ?? undefined;
  const universityId = resolvedParams?.universityId ?? undefined;
  const campusId = resolvedParams?.campusId ?? undefined;
  const majorId = resolvedParams?.majorId ?? undefined;
  const professorId = resolvedParams?.professorId ?? undefined;
  const courseId = resolvedParams?.courseId ?? undefined;
  const degreeLevel = (resolvedParams?.degreeLevel as DegreeLevel) ?? undefined;
  const source = (resolvedParams?.source as ReviewSource | 'all') ?? undefined;

  let initialData = undefined;
  try {
    initialData = await serverRegisteredReviewServices.getRegisteredReviews({
      page,
      q: search,
      universityId,
      campusId,
      majorId,
      professorId,
      courseId,
      degreeLevel: degreeLevel || undefined,
      source: source && source !== 'all' ? source : undefined,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <RegisteredReviewsClient initialData={initialData} />
    </Suspense>
  );
};

export default RegisteredReviewsModule;
