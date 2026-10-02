import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { InquiriesModule } from '@/modules/inquiries';
import type { Metadata } from 'next';

interface InquiriesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('inquiries');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function InquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  return (
    <RoleGuard permission="inquiries:read">
      <InquiriesModule searchParams={searchParams} />
    </RoleGuard>
  );
}
