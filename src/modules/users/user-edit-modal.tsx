'use client';

import {
  Button,
  Chip,
  Label,
  ListBox,
  Modal,
  Select,
  Tabs,
} from '@heroui/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit3,
  KeyRound,
  Shield,
  Sliders,
  User as UserIcon,
  Wand2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { UpdateUserDto } from '@/apis/services/users/_dto';
import type { UserListItem } from '@/apis/services/users';
import type { IUserScopes } from '@/models/user';
import { InputField, PasswordField, SwitchField } from '@/components/shared';
import { SYSTEM_PERMISSIONS_LIST } from '@/utils/permissions';
import { PermissionsSelector } from './permissions-selector';
import { ScopesSelector } from './scopes-selector';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string | number, values: UpdateUserDto) => Promise<void>;
  user: UserListItem | null;
  isPending?: boolean;
}

interface FormValues {
  name: string;
  role: string;
  isActive: boolean;
  password?: string;
}

interface UserEditModalFormProps {
  user: UserListItem;
  onClose: () => void;
  onSubmit: (id: string | number, values: UpdateUserDto) => Promise<void>;
  isPending?: boolean;
}

const UserEditModalForm = ({
  user,
  onClose,
  onSubmit,
  isPending = false,
}: UserEditModalFormProps) => {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user.permissions || [],
  );
  const [selectedScopes, setSelectedScopes] = useState<IUserScopes>(
    user.scopes || {
      allUniversities: true,
      universityIds: [],
      allCampuses: true,
      campusIds: [],
      allMajors: true,
      majorIds: [],
    },
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name || '',
      role: user.role || 'content_manager',
      isActive: user.isActive !== false,
      password: '',
    },
  });

  const currentRole = useWatch({ control, name: 'role' }) || 'content_manager';

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
      setSelectedPermissions(SYSTEM_PERMISSIONS_LIST.map((p) => p.code));
      setSelectedScopes({
        allUniversities: true,
        universityIds: [],
        allCampuses: true,
        campusIds: [],
        allMajors: true,
        majorIds: [],
      });
    } else if (roleKey === 'content_manager') {
      setSelectedPermissions([
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
      setSelectedPermissions([
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
      setSelectedPermissions([
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
    } else if (roleKey === 'custom') {
      // Keep existing custom selections intact
    }
  };

  const handleRoleSelectionChange = (newRole: string, fieldOnChange: (val: string) => void) => {
    fieldOnChange(newRole);
    applyRoleDefaultPermissions(newRole);
  };

  const handleFormSubmit = async (data: FormValues) => {
    const payload: UpdateUserDto = {
      name: data.name.trim(),
      role: data.role,
      roleIds: [data.role],
      isActive: data.isActive,
      permissions: selectedPermissions,
      scopes: selectedScopes,
    };
    if (data.password?.trim()) {
      payload.password = data.password.trim();
    }
    await onSubmit(user.id, payload);
    onClose();
  };

  return (
    <>
      <Modal.CloseTrigger />
      <Modal.Header className="pb-3 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-2xs">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <Modal.Heading className="text-lg font-bold text-neutral-900">
              {t('modals.editModalHeading')}
            </Modal.Heading>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-neutral-700">{user.name}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-neutral-500 font-mono" dir="ltr">
                @{user.username}
              </span>
            </div>
          </div>
        </div>
      </Modal.Header>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
        autoComplete="off"
      >
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
        <div className="px-6 pt-3 border-b border-neutral-200/60 bg-neutral-50/50">
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

        <Modal.Body className="flex-1 overflow-y-auto p-6">
          {/* 1. Basic Info & Role */}
          {activeTab === 'basic' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <InputField
                  label={t('modals.name')}
                  placeholder={t('modals.namePlaceholder')}
                  errorMessage={errors.name?.message}
                  isInvalid={Boolean(errors.name)}
                  isDisabled={isPending}
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  {...register('name', {
                    required: t('validation.nameMin'),
                  })}
                />

                {/* Username (Read Only in Edit) */}
                <InputField
                  label={t('modals.username')}
                  value={user.username}
                  isDisabled
                  dir="ltr"
                  className="font-mono text-left"
                />

                {/* Optional Password Update */}
                <div className="md:col-span-2">
                  <PasswordField
                    label={t('modals.editPassword')}
                    placeholder={t('modals.editPasswordPlaceholder')}
                    registration={register('password')}
                    autoComplete="new-password"
                    showPasswordLabel={tCommon('actions.view')}
                    hidePasswordLabel={tCommon('actions.close')}
                    isDisabled={isPending}
                  />
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label>{t('modals.role')}</Label>
                        <Select
                          selectedKey={field.value}
                          onSelectionChange={(key) =>
                            handleRoleSelectionChange(String(key), field.onChange)
                          }
                          isDisabled={isPending}
                          placeholder={t('modals.selectRole')}
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label={t('modals.role')}>
                              <ListBox.Item
                                id="content_manager"
                                textValue={t('roles.content_manager')}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold">
                                    {t('roles.content_manager')}
                                  </span>
                                  <span className="text-2xs text-neutral-400">
                                    {t('rolesDescriptions.content_manager')}
                                  </span>
                                </div>
                              </ListBox.Item>
                              <ListBox.Item
                                id="moderator"
                                textValue={t('roles.moderator')}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-secondary-700">
                                    {t('roles.moderator')}
                                  </span>
                                  <span className="text-2xs text-neutral-400">
                                    {t('rolesDescriptions.moderator')}
                                  </span>
                                </div>
                              </ListBox.Item>
                              <ListBox.Item
                                id="support_agent"
                                textValue={t('roles.support_agent')}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold">
                                    {t('roles.support_agent')}
                                  </span>
                                  <span className="text-2xs text-neutral-400">
                                    {t('rolesDescriptions.support_agent')}
                                  </span>
                                </div>
                              </ListBox.Item>
                              <ListBox.Item
                                id="custom"
                                textValue={t('roles.custom')}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-neutral-800">
                                    {t('roles.custom')}
                                  </span>
                                  <span className="text-2xs text-neutral-400">
                                    {t('rolesDescriptions.custom')}
                                  </span>
                                </div>
                              </ListBox.Item>
                              <ListBox.Item
                                id="super_admin"
                                textValue={t('roles.super_admin')}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-danger-700">
                                    {t('roles.super_admin')}
                                  </span>
                                  <span className="text-2xs text-neutral-400">
                                    {t('rolesDescriptions.super_admin')}
                                  </span>
                                </div>
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Active / Inactive Status Switch Card */}
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
                    activeLabel={t('statuses.active')}
                    inactiveLabel={t('statuses.inactive')}
                  />
                )}
              />
            </div>
          )}

          {/* 2. Organizational Scopes Tab */}
          {activeTab === 'scopes' && (
            <div className="flex flex-col gap-4">
              <ScopesSelector
                value={selectedScopes}
                onChange={setSelectedScopes}
                isDisabled={isPending}
              />
            </div>
          )}

          {/* 3. Detailed Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-primary-50/70 border border-primary-200/70">
                <div className="flex items-center gap-2.5 text-xs text-primary-900">
                  <KeyRound className="h-5 w-5 shrink-0 text-primary-600" />
                  <span>
                    {t('create.permissionsSectionDesc')}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => applyRoleDefaultPermissions()}
                  className="text-xs gap-1.5 shrink-0 self-end sm:self-auto bg-white hover:bg-primary-50 border-primary-300 text-primary-800"
                >
                  <Wand2 className="w-3.5 h-3.5 text-primary-600" />
                  {t('create.resetRoleDefaults', { role: getRoleLabel(currentRole) })}
                </Button>
              </div>

              <PermissionsSelector
                value={selectedPermissions}
                onChange={setSelectedPermissions}
                isDisabled={isPending}
              />
            </div>
          )}
        </Modal.Body>

        {/* Modal Footer with Stepper & Summary */}
        <Modal.Footer className="flex justify-between items-center border-t border-neutral-200/80 p-4 bg-neutral-50/60">
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <Chip size="sm" variant="soft" className="bg-primary-50 text-primary-700">
              {t('create.tabs.permissions', { count: selectedPermissions.length })}
            </Chip>
            <Chip size="sm" variant="soft" className="bg-blue-50 text-blue-700">
              {selectedScopes.allUniversities
                ? t('scopesSelector.presetGlobal')
                : t('create.tabs.universitiesCount', {
                    count: selectedScopes.universityIds?.length || 0,
                  })}
            </Chip>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onPress={onClose}
              isDisabled={isPending}
            >
              {tCommon('actions.cancel')}
            </Button>

            {/* Navigation helpers */}
            {activeTab === 'basic' && (
              <Button
                variant="primary"
                type="button"
                onPress={() => setActiveTab('scopes')}
                className="gap-1.5 px-5"
              >
                {tCommon('actions.nextStep')}
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}

            {activeTab === 'scopes' && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onPress={() => setActiveTab('basic')}
                  className="gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  {tCommon('actions.prevStep')}
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onPress={() => setActiveTab('permissions')}
                  className="gap-1.5 px-5"
                >
                  {tCommon('actions.nextStep')}
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </>
            )}

            {activeTab === 'permissions' && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onPress={() => setActiveTab('scopes')}
                  className="gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  {tCommon('actions.prevStep')}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isPending={isPending}
                  className="gap-1.5 px-6"
                >
                  <Check className="w-4 h-4" />
                  {tCommon('actions.save')}
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>
      </form>
    </>
  );
};

export const UserEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isPending = false,
}: UserEditModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container className="admin-modal-container w-full !max-w-4xl">
          <Modal.Dialog className="admin-modal-dialog w-full !max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {user && (
              <UserEditModalForm
                key={String(user.id)}
                user={user}
                onClose={onClose}
                onSubmit={onSubmit}
                isPending={isPending}
              />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default UserEditModal;
