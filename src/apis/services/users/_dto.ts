import type { IUserScopes, UserRole } from '@/models';

export interface UserDto {
  id: string | number;
  name: string;
  displayName?: string | null;
  username: string;
  role?: UserRole;
  roles?: string[];
  roleIds?: string[];
  isSuperAdmin?: boolean;
  permissions?: string[];
  scopes?: IUserScopes;
  isActive?: boolean;
  createdAt: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateUserDto {
  username: string;
  name?: string;
  displayName?: string;
  password?: string;
  role?: string;
  roleIds?: string[];
  permissions?: string[];
  scopes?: IUserScopes;
  isActive?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  displayName?: string;
  password?: string;
  role?: string;
  roleIds?: string[];
  permissions?: string[];
  scopes?: IUserScopes;
  isActive?: boolean;
}

export interface RoleDto {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissionCodes: string[];
}

export interface PermissionDto {
  id: string;
  code: string;
  description: string;
}

export type GetUsersResponseDto = UserDto[];
