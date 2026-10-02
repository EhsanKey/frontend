'use client';

import { Button } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { clientAuthServices } from '@/apis/services/auth/client';
import { InputField, PasswordField } from '@/components/shared';
import { QUERY_KEYS, ROUTES } from '@/constants';
import { usePostRequest } from '@/hooks';
import { createLoginSchema, type LoginFormValues } from './login.schema';
import type { LoginResult } from '@/apis/services/auth/client';

const LoginModule = () => {
  const t = useTranslations('auth.login');
  const tV = useTranslations('auth.validation');

  const router = useRouter();
  const queryClient = useQueryClient();

  const schema = useMemo(
    () =>
      createLoginSchema({
        usernameRequired: tV('username.required'),
        passwordRequired: tV('password.required'),
      }),
    [tV],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { mutateAsync: login, isPending } = usePostRequest<
    LoginFormValues,
    LoginResult
  >({
    requestFn: clientAuthServices.login,
    getSuccessDescription: (data) =>
      t('toast.success', {
        name: data.name,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.auth.me,
      });
      router.push(ROUTES.dashboard);
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  const handleQuickLogin = async (username: string) => {
    const password = username === 'admin' ? 'admin' : '123456';
    setValue('username', username);
    setValue('password', password);
    await login({ username, password });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 font-bold text-neutral-900">{t('title')}</h1>
        <p className="text-body-sm text-neutral-500">{t('description')}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <InputField
          label={t('fields.username.label')}
          placeholder={t('fields.username.placeholder')}
          autoComplete="username"
          isDisabled={isPending}
          errorMessage={errors.username?.message}
          isInvalid={Boolean(errors.username)}
          {...register('username')}
        />

        <PasswordField
          label={t('fields.password.label')}
          placeholder={t('fields.password.placeholder')}
          registration={register('password')}
          error={errors.password?.message}
          autoComplete="current-password"
          showPasswordLabel={t('fields.password.show')}
          hidePasswordLabel={t('fields.password.hide')}
          isDisabled={isPending}
        />

        <Button
          fullWidth
          size="md"
          variant="primary"
          type="submit"
          isPending={isPending}
          className="mt-2"
        >
          {t('actions.submit')}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-neutral-200" />
        <span className="bg-surface absolute px-3 text-caption text-neutral-400">
          {t('quickTestDivider')}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onPress={() => handleQuickLogin('admin')}
          isDisabled={isPending}
        >
          ⚡ {t('actions.demoAdmin')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onPress={() => handleQuickLogin('user')}
          isDisabled={isPending}
        >
          👤 {t('actions.demoUser')}
        </Button>
      </div>
    </div>
  );
};

export default LoginModule;
