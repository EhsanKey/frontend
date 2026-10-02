import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AUTH_COOKIE_NAME, ROUTES } from '@/constants';

const AuthLayout: FCC = async ({ children }) => {
  const t = await getTranslations('auth');
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (accessToken) {
    redirect(ROUTES.dashboard);
  }

  return (
    <main className="bg-background flex min-h-dvh w-full items-center justify-center px-4 py-6 sm:px-5 md:px-6 lg:px-8">
      <div className="bg-surface border-border flex w-full max-w-5xl flex-col-reverse overflow-hidden rounded-xl border shadow-sm lg:min-h-140 lg:flex-row">
        <section className="flex w-full shrink-0 items-center justify-center px-6 py-8 lg:w-[55%] lg:flex-1 lg:px-12">
          {children}
        </section>

        <section
          id="auth-image"
          aria-hidden="true"
          className="bg-primary-50 relative flex min-h-48 w-full flex-1 items-center justify-center overflow-hidden lg:min-h-140 lg:w-[45%] lg:flex-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-90" />
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-8 text-center text-white">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <Image
                src="/logo/logo-mark-primary-512.png"
                width={80}
                height={80}
                alt="Logo"
                className="brightness-200"
                unoptimized
              />
            </div>
            <h2 className="text-h2 font-bold">{t('banner.title')}</h2>
            <p className="text-body-sm max-w-xs text-white/80">
              {t('banner.description')}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
