import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { UserCreateModule } from '@/modules/users/create';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('users');
  return {
    title: `${t('modals.createTitle')} | ${t('meta.title')}`,
    description: t('description'),
  };
}

export default async function UserCreatePage() {
  return (
    <RoleGuard permission="users:create">
      <UserCreateModule />
    </RoleGuard>
  );
}
