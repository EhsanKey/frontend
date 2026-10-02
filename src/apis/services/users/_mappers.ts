import type { PermissionDto, RoleDto, UserDto } from './_dto';
import type { IPermission, IRole, IUser, IUserListItem } from '@/models';

export const toUserListItem = (dto: UserDto): IUserListItem => ({
  id: dto.id,
  name: dto.name,
  displayName: dto.displayName ?? null,
  username: dto.username,
  role: dto.role || (dto.roles?.[0] as string) || 'USER',
  roles: dto.roles ?? [],
  roleIds: dto.roleIds ?? dto.roles ?? [],
  isSuperAdmin: Boolean(dto.isSuperAdmin),
  permissions: dto.permissions ?? [],
  scopes: dto.scopes,
  createdAt: dto.createdAt,
  isActive: dto.isActive ?? true,
  status: dto.status || (dto.isActive === false ? 'INACTIVE' : 'ACTIVE'),
});

export const toUserModel = (dto: UserDto): IUser => ({
  id: dto.id,
  name: dto.name,
  displayName: dto.displayName ?? null,
  username: dto.username,
  role: dto.role || (dto.roles?.[0] as string) || 'USER',
  roles: dto.roles ?? [],
  roleIds: dto.roleIds ?? dto.roles ?? [],
  isSuperAdmin: Boolean(dto.isSuperAdmin),
  permissions: dto.permissions ?? [],
  scopes: dto.scopes,
  createdAt: dto.createdAt,
  isActive: dto.isActive ?? true,
});

export const toRoleModel = (dto: RoleDto): IRole => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  permissions: dto.permissions ?? [],
});

export const toPermissionModel = (dto: PermissionDto): IPermission => ({
  id: dto.id,
  code: dto.code,
  description: dto.description,
});
