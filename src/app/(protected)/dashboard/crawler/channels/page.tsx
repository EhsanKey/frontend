import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { CrawlerChannelsModule } from '@/modules/crawler/channels';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('crawler.channels');
  return {
    title: t('title'),
    description: t('description'),
  };
}

interface CrawlerChannelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CrawlerChannelsPage({ searchParams }: CrawlerChannelsPageProps) {
  return (
    <RoleGuard permission="crawler:read">
      <CrawlerChannelsModule searchParams={searchParams as any} />
    </RoleGuard>
  );
}
