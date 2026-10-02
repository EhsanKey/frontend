import { getTranslations } from 'next-intl/server';
import { ItemsModule } from '@/modules';
import type { Metadata } from 'next';

type ItemsPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('items');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ItemsPage({ searchParams }: ItemsPageProps) {
  return <ItemsModule searchParams={searchParams} />;
}
