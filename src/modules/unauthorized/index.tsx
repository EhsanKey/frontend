'use client';

import { Button } from '@heroui/react';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';

export const UnauthorizedModule = () => {
  const t = useTranslations('mainLayout.unauthorized');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="bg-danger-50 text-danger-600 mb-4 rounded-full p-4">
        <ShieldAlert className={ICON_SIZE_CLASS.lg} />
      </div>

      <h1 className="text-h2 font-bold text-neutral-900">{t('title')}</h1>
      <p className="mt-2 max-w-md text-body-sm text-neutral-500">
        {t('description')}
      </p>

      <div className="mt-6">
        <Link href={ROUTES.dashboard}>
          <Button size="md" variant="primary">
            {t('backToDashboard')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedModule;
