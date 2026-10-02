import { getTranslations } from 'next-intl/server';
import { DashboardModule } from '@/modules';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('mainLayout');

  return {
    title: t('nav.dashboard'),
  };
}

export default function DashboardPage() {
  return <DashboardModule />;
}
