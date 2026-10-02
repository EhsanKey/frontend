import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ReviewsModule } from '@/modules/reviews';
import type { Metadata } from 'next';

interface ReviewsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reviews');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  return (
    <RoleGuard permission="reviews:read">
      <ReviewsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
