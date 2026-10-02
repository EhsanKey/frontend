import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ReviewEditModule } from '@/modules/reviews/edit';

interface ReviewEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ReviewEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('reviews');

  return {
    title: `${t('modals.editTitle')} #${id} | ${t('meta.title')}`,
    description: t('description'),
  };
}

export default async function ReviewEditPage({ params }: ReviewEditPageProps) {
  const { id } = await params;

  return (
    <RoleGuard permission="reviews:update">
      <ReviewEditModule id={id} />
    </RoleGuard>
  );
}
