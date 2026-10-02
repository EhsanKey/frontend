import { getTranslations } from 'next-intl/server';
import { LoginModule } from '@/modules';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');

  return {
    title: t('meta.login.title'),
    description: t('meta.login.description'),
  };
}

export default function LoginPage() {
  return <LoginModule />;
}
