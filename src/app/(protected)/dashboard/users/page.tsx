import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { UsersModule } from '@/modules';
import type { Metadata } from 'next';

type UsersPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('users');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <RoleGuard permission="admins:manage">
      <UsersModule searchParams={searchParams} />
    </RoleGuard>
  );
}
