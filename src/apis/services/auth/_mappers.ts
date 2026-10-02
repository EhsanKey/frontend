import { toBackendProxyHref } from '@/utils';
import type { AuthUserDto } from './_dto';
import type { IUser } from '@/models';

export const toUserModel = (dto: AuthUserDto): IUser => ({
  id: dto.id,
  name: dto.name,
  username: dto.username,
  role: dto.role,
  roles: dto.roles ?? [dto.role],
  isSuperAdmin: Boolean(dto.isSuperAdmin),
  profileImageUrl: dto.profileImageUrl
    ? toBackendProxyHref(dto.profileImageUrl)
    : null,
  permissions: dto.permissions ?? [],
  createdAt: dto.createdAt ?? null,
  lastLoginAt: dto.lastLoginAt ?? null,
});
