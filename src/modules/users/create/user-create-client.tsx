'use client';

import {
  Button,
  Chip,
  Label,
  ListBox,
  Select,
  Tabs,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  KeyRound,
  Shield,
  Sliders,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { clientUserServices } from '@/apis/services/users/client';
import { InputField, PasswordField, SwitchField } from '@/components/shared';
import { usePostRequest } from '@/hooks';
import type { IUserScopes } from '@/models/user';
import { SYSTEM_PERMISSIONS_LIST } from '@/utils/permissions';
import { PermissionsSelector } from '../permissions-selector';
import { ScopesSelector } from '../scopes-selector';
import {
  createUserCreateSchema,
  type UserCreateFormValues,
} from './user-create.schema';

export const UserCreateClient = () => {
  const router = useRouter();
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<string>('basic');

  const schema = createUserCreateSchema({
    usernameMin: t('validation.usernameMin'),
    usernameMax: t('validation.usernameMax'),
    usernameRegex: t('validation.usernameRegex'),
    nameMin: t('validation.nameMin'),
    nameMax: t('validation.nameMax'),
    passwordMin: t('validation.passwordMin'),
    roleRequired: t('validation.roleRequired'),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      name: '',
      password: '',
      role: 'content_manager',
      isActive: true,
      permissions: [
        'reviews:read',
        'reviews:approve',
        'reviews:status',
        'reviews:update',
        'reviews:delete',
        'resources:read',
        'resources:approve',
        'resources:status',
        'resources:update',
        'resources:delete',
        'professors:manage',
        'courses:manage',
        'teachings:manage',
        'cache:read',
        'cache:manage',
      ],
      scopes: {
        allUniversities: false,
        universityIds: [],
        allCampuses: true,
        campusIds: [],
        allMajors: true,
        majorIds: [],
      },
    },
  });

  const currentRole = useWatch({ control, name: 'role' }) || 'content_manager';
  const selectedPermissions = useWatch({ control, name: 'permissions' }) || [];
  const selectedScopes = useWatch({ control, name: 'scopes' }) || {
    allUniversities: false,
    universityIds: [],
    allCampuses: true,
    campusIds: [],
    allMajors: true,
    majorIds: [],
  };

  const { mutateAsync: createUserMutate, isPending } = usePostRequest({
    requestFn: (data: UserCreateFormValues) =>
      clientUserServices.createUser({
        username: data.username.trim().toLowerCase(),
        name: data.name.trim(),
        password: data.password,
        role: data.role,
        roleIds: [data.role],
        isActive: data.isActive,
        permissions: data.permissions,
        scopes: data.scopes,
      }),
    onSuccess: () => {
      router.push('/dashboard/users');
    },
  });

  const getRoleLabel = (r?: string) => {
    if (r === 'super_admin') return t('roles.super_admin');
    if (r === 'content_manager') return t('roles.content_manager');
    if (r === 'moderator') return t('roles.moderator');
    if (r === 'support_agent') return t('roles.support_agent');
    if (r === 'custom') return t('roles.custom');
    if (r === 'ADMIN') return t('roles.ADMIN');
    if (r === 'USER') return t('roles.USER');
    return r || '';
  };

  const applyRoleDefaultPermissions = (roleToApply?: string) => {
    const roleKey = roleToApply || currentRole;
    if (roleKey === 'super_admin') {
      setValue('permissions', SYSTEM_PERMISSIONS_LIST.map((p) => p.code));
      setValue('scopes', {
        allUniversities: true,
        universityIds: [],
        allCampuses: true,
        campusIds: [],
        allMajors: true,
        majorIds: [],
      });
    } else if (roleKey === 'content_manager') {
      setValue('permissions', [
        'universities:read',
        'universities:create',
        'universities:update',
        'campuses:read',
        'campuses:create',
        'campuses:update',
        'majors:read',
        'majors:create',
        'majors:update',
        'professors:read',
        'professors:create',
        'professors:update',
        'professors:delete',
        'professors:merge',
        'courses:read',
        'courses:create',
        'courses:update',
        'courses:delete',
        'courses:merge',
        'teachings:read',
        'teachings:create',
        'teachings:update',
        'teachings:delete',
        'reviews:read',
        'resources:read',
        'cache:read',
        'cache:manage',
      ]);
    } else if (roleKey === 'moderator') {
      setValue('permissions', [
        'reviews:read',
        'reviews:create',
        'reviews:update',
        'reviews:status',
        'reviews:approve',
        'reviews:delete',
        'resources:read',
        'resources:create',
        'resources:update',
        'resources:status',
        'resources:approve',
        'resources:delete',
        'professors:read',
        'courses:read',
        'teachings:read',
        'universities:read',
        'campuses:read',
        'majors:read',
      ]);
    } else if (roleKey === 'support_agent') {
      setValue('permissions', [
        'inquiries:read',
        'inquiries:trigger',
        'inquiries:manage',
        'errors:read',
        'errors:resolve',
        'errors:manage',
        'reviews:read',
        'resources:read',
        'telegram:read',
        'groups:read',
        'groups:manage',
        'analytics:read',
        'system_pipeline:read',
      ]);
    }
  };

  const handleRoleSelectionChange = (newRole: string) => {
    setValue('role', newRole);
    applyRoleDefaultPermissions(newRole);
  };

  const onSubmit = async (values: UserCreateFormValues) => {
    await createUserMutate(values);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 w-full">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-2xs">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t('modals.createTitle')}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t('create.subtitle')}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onPress={() => router.push('/dashboard/users')}
          isDisabled={isPending}
        >
          <ArrowRight className="h-4 w-4" />
          <span>{tCommon('actions.back')}</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
        {/* Decoy inputs to defeat browser credential autofill heuristics */}
        <input
          type="text"
          name="prevent_autofill_username"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none', zIndex: -1 }}
        />
        <input
          type="password"
          name="prevent_autofill_password"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="new-password"
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none', zIndex: -1 }}
        />

        {/* Step / Tab Navigation */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 shadow-xs">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(String(key))}
          >
            <Tabs.List className="w-full grid grid-cols-3 gap-2">
              <Tabs.Tab id="basic" className="gap-2 py-3">
                <UserIcon className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">{t('create.tabs.basic')}</span>
              </Tabs.Tab>
              <Tabs.Tab id="scopes" className="gap-2 py-3">
                <Sliders className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">
                  {t('create.tabs.scopes', {
                    summary: selectedScopes.allUniversities
                      ? t('scopesSelector.presetGlobal')
                      : t('create.tabs.universitiesCount', {
                          count: selectedScopes.universityIds?.length || 0,
                        }),
                  })}
                </span>
              </Tabs.Tab>
              <Tabs.Tab id="permissions" className="gap-2 py-3">
                <Shield className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">
                  {t('create.tabs.permissions', { count: selectedPermissions.length })}
                </span>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <KeyRound className="h-5 w-5 text-primary-600" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {t('create.sections.auth')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label={t('modals.username')}
                placeholder={t('modals.usernamePlaceholder')}
                registration={register('username')}
                error={errors.username?.message}
                required
                isDisabled={isPending}
                autoComplete="new-username"
              />

              <InputField
                label={t('modals.name')}
                placeholder={t('modals.namePlaceholder')}
                registration={register('name')}
                error={errors.name?.message}
                required
                isDisabled={isPending}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PasswordField
                label={t('modals.password')}
                placeholder={t('modals.passwordPlaceholder')}
                registration={register('password')}
                error={errors.password?.message}
                showPasswordLabel={tCommon('actions.view')}
                hidePasswordLabel={tCommon('actions.close')}
                isDisabled={isPending}
                autoComplete="new-password"
              />

              <div className="flex flex-col gap-1.5">
                <Label className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('modals.role')} <span className="text-danger-500">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={(key) => handleRoleSelectionChange(String(key))}
                      variant="secondary"
                      placeholder={t('modals.selectRole')}
                      className="w-full"
                      isDisabled={isPending}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label={t('modals.role')}>
                          <ListBox.Item id="super_admin" textValue={t('roles.super_admin')}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-danger-700 dark:text-danger-400">
                                {t('roles.super_admin')}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {t('rolesDescriptions.super_admin')}
                              </span>
                            </div>
                          </ListBox.Item>
                          <ListBox.Item id="content_manager" textValue={t('roles.content_manager')}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-primary-700 dark:text-primary-400">
                                {t('roles.content_manager')}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {t('rolesDescriptions.content_manager')}
                              </span>
                            </div>
                          </ListBox.Item>
                          <ListBox.Item id="moderator" textValue={t('roles.moderator')}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-warning-700 dark:text-warning-400">
                                {t('roles.moderator')}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {t('rolesDescriptions.moderator')}
                              </span>
                            </div>
                          </ListBox.Item>
                          <ListBox.Item id="support_agent" textValue={t('roles.support_agent')}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-info-700 dark:text-info-400">
                                {t('roles.support_agent')}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {t('rolesDescriptions.support_agent')}
                              </span>
                            </div>
                          </ListBox.Item>
                          <ListBox.Item id="custom" textValue={t('roles.custom')}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {t('roles.custom')}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {t('rolesDescriptions.custom')}
                              </span>
                            </div>
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                />
                {errors.role?.message && (
                  <span className="text-caption text-danger-600 font-medium">
                    {errors.role.message}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label={t('create.activeStatusLabel')}
                    description={t('create.activeStatusDesc')}
                    isSelected={field.value}
                    onChange={field.onChange}
                    isDisabled={isPending}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Organizational Scopes */}
        {activeTab === 'scopes' && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('create.scopesSectionTitle')}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {t('create.scopesSectionDesc')}
                </p>
              </div>
              <Chip size="sm" variant="secondary" className="font-medium">
                {t('create.currentRole', { role: getRoleLabel(currentRole) })}
              </Chip>
            </div>

            <ScopesSelector
              value={selectedScopes}
              onChange={(newScopes: IUserScopes) => setValue('scopes', newScopes)}
              isDisabled={isPending}
            />
          </div>
        )}

        {/* Tab 3: Granular Permissions */}
        {activeTab === 'permissions' && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('create.permissionsSectionTitle')}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {t('create.permissionsSectionDesc')}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onPress={() => applyRoleDefaultPermissions()}
                isDisabled={isPending}
              >
                {t('create.resetRoleDefaults', { role: getRoleLabel(currentRole) })}
              </Button>
            </div>

            <PermissionsSelector
              selectedPermissions={selectedPermissions}
              onChange={(perms: string[]) => setValue('permissions', perms)}
              isDisabled={isPending}
            />
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            {activeTab !== 'basic' && (
              <Button
                variant="outline"
                onPress={() => {
                  if (activeTab === 'permissions') setActiveTab('scopes');
                  else if (activeTab === 'scopes') setActiveTab('basic');
                }}
                isDisabled={isPending}
              >
                {tCommon('actions.prevStep')}
              </Button>
            )}
            {activeTab !== 'permissions' && (
              <Button
                variant="secondary"
                onPress={() => {
                  if (activeTab === 'basic') setActiveTab('scopes');
                  else if (activeTab === 'scopes') setActiveTab('permissions');
                }}
                isDisabled={isPending}
              >
                {tCommon('actions.nextStep')}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onPress={() => router.push('/dashboard/users')}
              isDisabled={isPending}
            >
              {tCommon('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isPending={isPending}
              className="px-6"
            >
              {t('modals.submit')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserCreateClient;
