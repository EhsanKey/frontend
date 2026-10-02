'use client';

import { Spinner } from '@heroui/react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { canAccessRoute } from '@/utils';
import type { UserRole } from '@/models';

export type RoleGuardProps = {
  allowedRoles?: UserRole[];
  adminOnly?: boolean;
  permission?: string;
  fallback?: React.ReactNode;
  blurOnDenied?: boolean;
  blurMessage?: string;
};

const RoleGuard: FCC<RoleGuardProps> = ({
  children,
  allowedRoles,
  adminOnly,
  permission,
  fallback,
  blurOnDenied = false,
  blurMessage,
}) => {
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { user, isLoading, isUnauthenticated } = useAuth();

  const isAuthorized = canAccessRoute(user, {
    allowedRoles,
    adminOnly,
    permission,
  });

  useEffect(() => {
    if (!isLoading && !isAuthorized && !fallback && !blurOnDenied) {
      router.replace(ROUTES.unauthorized);
    }
  }, [isLoading, isAuthorized, fallback, blurOnDenied, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isUnauthenticated || !isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (blurOnDenied) {
      return (
        <div className="relative overflow-hidden rounded-2xl w-full select-none">
          <div className="filter blur-md pointer-events-none opacity-40 transition-all">
            {children}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-6 text-center">
            <div className="rounded-full bg-neutral-100/90 border border-neutral-200 p-3 shadow-2xs text-neutral-700 mb-2.5">
              <Lock className="w-5 h-5 text-neutral-800" />
            </div>
            <p className="text-body-sm font-bold text-neutral-900">
              {blurMessage || tCommon('ui.managerAccessRequired')}
            </p>
            {permission && (
              <p className="mt-1 text-caption font-mono text-neutral-500" dir="ltr">
                {permission}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
