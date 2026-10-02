import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { CrawlerReviewsModule } from '@/modules/crawler/reviews';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('crawler.reviews');
  return {
    title: t('title'),
    description: t('description'),
  };
}

interface CrawlerReviewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CrawlerReviewsPage({ searchParams }: CrawlerReviewsPageProps) {
  return (
    <RoleGuard permission="crawler:read">
      <CrawlerReviewsModule searchParams={searchParams as any} />
    </RoleGuard>
  );
}
