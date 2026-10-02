import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { RegisteredReviewsModule } from '@/modules/registered-reviews';
import type { Metadata } from 'next';

interface RegisteredReviewsPageProps {
  searchParams: Promise<{
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('registeredReviews');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function RegisteredReviewsPage({
  searchParams,
}: RegisteredReviewsPageProps) {
  return (
    <RoleGuard permission="reviews:read">
      <RegisteredReviewsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
