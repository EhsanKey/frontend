'use client';

import { Avatar, Button, Card, Chip, Tabs } from '@heroui/react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  LogOut,
  School,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { SearchInput } from '@/components/shared';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { useAuth } from '@/hooks';
import { formatPersianDate } from '@/utils';
import { SYSTEM_PERMISSIONS_LIST } from '@/utils/permissions';

export default function ProfilePage() {
  const t = useTranslations('mainLayout');
  const tUsers = useTranslations('users');
  const tCommon = useTranslations('common');
  const { user, logout, isLoggingOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.includes('super_admin') ||
    user?.isSuperAdmin ||
    user?.permissions?.includes('*') ||
    user?.permissions?.includes('*:manage');

  // Compute active permissions for this user
  const userPermissions = useMemo(() => {
    if (!user) return [];
    if (isSuperAdmin) {
      return SYSTEM_PERMISSIONS_LIST;
    }
    const userPermSet = new Set(user.permissions || []);
    const known = SYSTEM_PERMISSIONS_LIST.filter((perm) =>
      userPermSet.has(perm.code)
    );
    const knownCodes = new Set(known.map((p) => p.code));

    const customPerms = Array.from(userPermSet)
      .filter((code) => !knownCodes.has(code) && code !== '*' && code !== '*:manage')
      .map((code) => ({
        code,
        title: code,
        description: tUsers('profile.customPermissionDesc'),
        category: 'custom',
        categoryTitle: tUsers('profile.customPermissionsCat'),
      }));

    return [...known, ...customPerms];
  }, [user, isSuperAdmin, tUsers]);

  // Categories present in active permissions
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    userPermissions.forEach((p) => cats.set(p.category, p.categoryTitle));
    return Array.from(cats.entries()).map(([id, title]) => ({ id, title }));
  }, [userPermissions]);

  const filteredPermissions = useMemo(() => {
    return userPermissions.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.title.includes(searchQuery) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [userPermissions, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">{t('nav.profile')}</h1>
        <p className="mt-1 text-body-sm text-neutral-500">
          {tUsers('profile.subtitle')}
        </p>
      </div>

      {/* User Information Card */}
      <Card className="border border-neutral-200/80 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="bg-primary-600 text-white size-20 text-2xl font-bold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-h3 font-bold text-neutral-900">{user?.name}</h2>
                {isSuperAdmin ? (
                  <Chip
                    size="sm"
                    variant="soft"
                    className="bg-danger-50 text-danger-700 font-semibold gap-1 inline-flex items-center"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {tUsers('profile.superAdmin')}
                  </Chip>
                ) : (
                  <Chip
                    size="sm"
                    variant="soft"
                    className="bg-primary-50 text-primary-700 font-semibold gap-1 inline-flex items-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user?.role || tCommon('ui.systemUser')}
                  </Chip>
                )}
              </div>
              <p className="text-body-sm font-mono text-neutral-500">@{user?.username}</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="md"
            onPress={() => void logout()}
            isPending={isLoggingOut}
            className="gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            {tUsers('profile.logout')}
          </Button>
        </div>

        {/* Quick Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-neutral-100 pt-6">
          <div className="bg-neutral-50 rounded-xl p-3.5 flex items-center gap-3 border border-neutral-100">
            <User className={ICON_SIZE_CLASS.md + ' text-neutral-400 shrink-0'} />
            <div>
              <p className="text-caption text-neutral-500">{tUsers('profile.systemUsername')}</p>
              <p className="font-semibold text-neutral-900 font-mono text-sm">{user?.username}</p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3.5 flex items-center gap-3 border border-neutral-100">
            <ShieldCheck className={ICON_SIZE_CLASS.md + ' text-neutral-400 shrink-0'} />
            <div>
              <p className="text-caption text-neutral-500">{tUsers('profile.activePermissionsCount')}</p>
              <p className="font-semibold text-neutral-900 text-sm">
                {isSuperAdmin
                  ? tCommon('labels.fullAccess')
                  : tCommon('labels.permissionsCount', { count: userPermissions.length })}
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3.5 flex items-center gap-3 border border-neutral-100">
            <Calendar className={ICON_SIZE_CLASS.md + ' text-neutral-400 shrink-0'} />
            <div>
              <p className="text-caption text-neutral-500">{tUsers('profile.lastLogin')}</p>
              <p className="font-semibold text-neutral-900 text-sm">
                {user?.lastLoginAt ? formatPersianDate(user.lastLoginAt) : tCommon('labels.today')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Scopes Section (ABAC) */}
      <Card className="border border-neutral-200/80 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100/60 text-primary-700">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">{tUsers('profile.scopesTitle')}</h3>
            <p className="text-xs text-neutral-500">
              {tUsers('profile.scopesDescription')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Universities Scope */}
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
                <School className="w-4 h-4 text-primary-600" />
                {tUsers('profile.universities')}
              </span>
              <Chip
                size="sm"
                variant="soft"
                className={
                  user?.scopes?.allUniversities || isSuperAdmin
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-primary-50 text-primary-700'
                }
              >
                {user?.scopes?.allUniversities || isSuperAdmin
                  ? tCommon('actions.global')
                  : tCommon('actions.limited')}
              </Chip>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {user?.scopes?.allUniversities || isSuperAdmin
                ? tUsers('profile.allUniversitiesAccess')
                : user?.scopes?.universityIds?.length
                  ? tUsers('profile.limitedUniversitiesAccess', { count: user.scopes.universityIds.length })
                  : tUsers('profile.noUniversitiesAccess')}
            </p>
            {!user?.scopes?.allUniversities && !isSuperAdmin && user?.scopes?.universityIds && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.scopes.universityIds.map((id) => (
                  <span
                    key={id}
                    className="text-2xs font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-600"
                  >
                    {tCommon('labels.recordId', { id })}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Campuses Scope */}
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {tUsers('profile.campuses')}
              </span>
              <Chip
                size="sm"
                variant="soft"
                className={
                  user?.scopes?.allCampuses || isSuperAdmin
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-emerald-50 text-emerald-700'
                }
              >
                {user?.scopes?.allCampuses || isSuperAdmin
                  ? tCommon('actions.global')
                  : tCommon('actions.limited')}
              </Chip>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {user?.scopes?.allCampuses || isSuperAdmin
                ? tUsers('profile.allCampusesAccess')
                : user?.scopes?.campusIds?.length
                  ? tUsers('profile.limitedCampusesAccess', { count: user.scopes.campusIds.length })
                  : tUsers('profile.noCampusesAccess')}
            </p>
            {!user?.scopes?.allCampuses && !isSuperAdmin && user?.scopes?.campusIds && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.scopes.campusIds.map((id) => (
                  <span
                    key={id}
                    className="text-2xs font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-600"
                  >
                    {tCommon('labels.recordId', { id })}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Majors Scope */}
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                {tUsers('profile.majors')}
              </span>
              <Chip
                size="sm"
                variant="soft"
                className={
                  user?.scopes?.allMajors || isSuperAdmin
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-indigo-50 text-indigo-700'
                }
              >
                {user?.scopes?.allMajors || isSuperAdmin
                  ? tCommon('actions.global')
                  : tCommon('actions.limited')}
              </Chip>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {user?.scopes?.allMajors || isSuperAdmin
                ? tUsers('profile.allMajorsAccess')
                : user?.scopes?.majorIds?.length
                  ? tUsers('profile.limitedMajorsAccess', { count: user.scopes.majorIds.length })
                  : tUsers('profile.noMajorsAccess')}
            </p>
            {!user?.scopes?.allMajors && !isSuperAdmin && user?.scopes?.majorIds && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.scopes.majorIds.map((id) => (
                  <span
                    key={id}
                    className="text-2xs font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-600"
                  >
                    {tCommon('labels.recordId', { id })}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Permissions Breakdown Card */}
      <Card className="border border-neutral-200/80 bg-white p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/60 text-emerald-700">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {tUsers('profile.activePermissionsTitle', { count: userPermissions.length })}
              </h3>
              <p className="text-xs text-neutral-500">
                {tUsers('profile.activePermissionsSubtitle')}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              queryValue={searchQuery}
              onValueChange={setSearchQuery}
              placeholder={tUsers('profile.searchPermissionsPlaceholder')}
            />
          </div>
        </div>

        {isSuperAdmin && (
          <div className="mb-4 flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs">
            <Sparkles className="w-5 h-5 shrink-0 text-amber-600" />
            <p>
              {tUsers('profile.superAdminFullAccessNotice')}
            </p>
          </div>
        )}

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-4 overflow-x-auto pb-1">
            <Tabs
              selectedKey={selectedCategory}
              onSelectionChange={(key) => setSelectedCategory(String(key))}
            >
              <Tabs.List className="gap-1 bg-neutral-100/70 p-1 rounded-xl">
                <Tabs.Tab id="all">
                  {tUsers('profile.allPermissions', { count: userPermissions.length })}
                </Tabs.Tab>
                {categories.map((cat) => (
                  <Tabs.Tab key={cat.id} id={cat.id}>
                    {cat.title}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>
        )}

        {/* Permissions Grid */}
        {filteredPermissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPermissions.map((perm) => (
              <div
                key={perm.code}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/30 hover:bg-neutral-50 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {perm.title}
                    </span>
                    <span className="text-2xs font-mono bg-neutral-200/60 text-neutral-700 px-1.5 py-0.5 rounded dir-ltr shrink-0">
                      {perm.code}
                    </span>
                  </div>
                  <p className="text-2xs text-neutral-500 mt-1 leading-relaxed">
                    {perm.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-400 text-xs">
            {searchQuery ? tUsers('profile.noSearchMatch') : tUsers('profile.noActivePermissions')}
          </div>
        )}
      </Card>
    </div>
  );
}
