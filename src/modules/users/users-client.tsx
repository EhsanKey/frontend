'use client';

import { Button, Chip, Switch, toast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Edit2, Plus, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { SearchInput } from '@/components/shared';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useGetRequest, usePostRequest, useQueryState } from '@/hooks';
import { clientUserServices } from '@/apis/services/users/client';
import { cn, formatPersianDate, hasPermission } from '@/utils';
import { useRouter } from 'next/navigation';
import { UserEditModal } from './user-edit-modal';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { UpdateUserDto } from '@/apis/services/users/_dto';
import type { UserListItem } from '@/apis/services/users';

type ColumnKey =
  | 'id'
  | 'name'
  | 'username'
  | 'role'
  | 'permissions'
  | 'createdAt'
  | 'status'
  | 'actions';

type UsersClientProps = {
  initialData: PaginatedResult<UserListItem>;
};

export const UsersClient = ({ initialData }: UsersClientProps) => {
  const router = useRouter();
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { getQuery, updateQueries } = useQueryState();
  const search = getQuery('search') ?? '';
  const page = Number(getQuery('page')) || 1;

  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);

  const canManageAdmins = hasPermission(currentUser, 'admins:manage');

  // Queries
  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.users.list({ page, search }),
    requestFn: (signal) =>
      clientUserServices.getUsers({ page, search: search || undefined }, signal),
    initialData,
    keepPreviousData: true,
  });

  // Mutations

  const { mutateAsync: updateUserMutate, isPending: isUpdating } = usePostRequest({
    requestFn: ({ id, payload }: { id: string | number; payload: UpdateUserDto }) =>
      clientUserServices.updateUser(id, payload),
    onSuccess: () => {
      toast.success(tCommon('toast.successDescription'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.lists });
    },
  });

  const handleToggleStatus = async (userItem: UserListItem) => {
    if (!canManageAdmins) return;
    const newStatus = !userItem.isActive;
    try {
      await updateUserMutate({
        id: userItem.id,
        payload: { isActive: newStatus },
      });
      toast.success(
        newStatus
          ? t('statusActivated', { name: userItem.name })
          : t('statusDeactivated', { name: userItem.name }),
      );
    } catch {
      toast.danger(t('statusChangeError'));
    }
  };

  const headerCells: TableHeaderOptions<ColumnKey>[] = [
    { id: 'id', label: t('columns.id'), className: 'w-20 text-center' },
    { id: 'name', label: t('columns.name'), className: 'min-w-40', isRowHeader: true },
    { id: 'username', label: t('columns.username'), className: 'min-w-32 font-mono' },
    { id: 'role', label: t('columns.role'), className: 'w-44 text-center' },
    { id: 'permissions', label: t('columns.permissions'), className: 'w-36 text-center' },
    { id: 'createdAt', label: t('columns.createdAt'), className: 'w-36 text-center' },
    { id: 'status', label: t('columns.status'), className: 'w-36 text-center' },
    { id: 'actions', label: tCommon('table.actions'), className: 'w-28 text-center' },
  ];

  const renderCell = (item: UserListItem, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-mono text-caption text-neutral-500">#{item.id}</span>;
      case 'name':
        return <span className="font-semibold text-neutral-900">{item.name}</span>;
      case 'username':
        return <span className="text-neutral-500 font-mono" dir="ltr">@{item.username}</span>;
      case 'role': {
        const role = item.role || item.roles?.[0];
        if (role === 'super_admin' || item.isSuperAdmin) {
          return (
            <Chip
              size="sm"
              variant="soft"
              className="bg-danger-50 text-danger-700 font-semibold gap-1 inline-flex items-center"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {t('roles.super_admin')}
            </Chip>
          );
        }
        if (role === 'content_manager') {
          return (
            <Chip
              size="sm"
              variant="soft"
              className="bg-primary-50 text-primary-700 font-semibold gap-1 inline-flex items-center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('roles.content_manager')}
            </Chip>
          );
        }
        if (role === 'moderator') {
          return (
            <Chip
              size="sm"
              variant="soft"
              className="bg-secondary-50 text-secondary-700 font-semibold gap-1 inline-flex items-center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('roles.moderator')}
            </Chip>
          );
        }
        if (role === 'support_agent') {
          return (
            <Chip
              size="sm"
              variant="soft"
              className="bg-warning-50 text-warning-800 font-semibold gap-1 inline-flex items-center"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('roles.support_agent')}
            </Chip>
          );
        }
        if (role === 'custom') {
          return (
            <Chip
              size="sm"
              variant="soft"
              className="bg-neutral-100 text-neutral-800 font-semibold gap-1 inline-flex items-center border border-neutral-300"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('roles.custom')}
            </Chip>
          );
        }
        return (
          <Chip size="sm" variant="soft" className="bg-neutral-100 text-neutral-600">
            {role || t('roles.USER')}
          </Chip>
        );
      }
      case 'permissions':
        return (
          <span className="text-caption text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full font-medium">
            {t('activePermissionsBadge', { count: item.permissions?.length ?? 0 })}
          </span>
        );
      case 'createdAt':
        return <span className="text-caption text-neutral-600">{formatPersianDate(item.createdAt)}</span>;
      case 'status':
        return (
          <div className="flex items-center justify-center gap-2">
            <Switch
              size="sm"
              isSelected={item.isActive ?? true}
              onChange={() => handleToggleStatus(item)}
              isDisabled={isUpdating || !canManageAdmins || String(item.id) === String(currentUser?.id)}
              aria-label={t('columns.status')}
            />
            <span
              className={cn(
                'text-2xs font-semibold',
                item.isActive ? 'text-success-700' : 'text-neutral-400',
              )}
            >
              {item.isActive ? t('statuses.active') : t('statuses.inactive')}
            </span>
          </div>
        );
      case 'actions':
        if (!canManageAdmins) {
          return <span className="text-neutral-400 text-caption">-</span>;
        }
        return (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-8 px-2.5"
              onPress={() => setEditingUser(item)}
            >
              <Edit2 className="w-3.5 h-3.5" />
              {tCommon('actions.edit')}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>

      {canManageAdmins && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onPress={() => router.push('/dashboard/users/create')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('actions.createUser')}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            queryValue={search}
            onValueChange={(val: string) => {
              updateQueries({ search: val || null, page: null });
            }}
            placeholder={t('searchPlaceholder')}
          />
        </div>
      </div>

      <TableContainer
        ariaLabel={t('title')}
        headerCells={headerCells}
        items={data?.items ?? []}
        pagination={
          data?.meta
            ? {
                ...data.meta,
                onPageChange: (newPage) => {
                  updateQueries({ page: newPage > 1 ? String(newPage) : null });
                },
              }
            : undefined
        }
        isLoading={isLoading}
        renderCell={renderCell}
      />


      <UserEditModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSubmit={async (id, payload) => {
          await updateUserMutate({ id, payload });
        }}
        isPending={isUpdating}
      />
    </div>
  );
};

export default UsersClient;
