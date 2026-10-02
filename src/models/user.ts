export type UserRole =
  | 'super_admin'
  | 'content_manager'
  | 'moderator'
  | 'support_agent'
  | 'custom'
  | 'ADMIN'
  | 'USER'
  | string;

export interface IPermission {
  id: string;
  code: string;
  description: string;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface IUserScopes {
  allUniversities?: boolean;
  universityIds?: string[];
  allCampuses?: boolean;
  campusIds?: string[];
  allMajors?: boolean;
  majorIds?: string[];
}

export interface IUser {
  id: string | number;
  name: string;
  displayName?: string | null;
  username: string;
  role: UserRole;
  roles?: string[];
  roleIds?: string[];
  isSuperAdmin?: boolean;
  profileImageUrl?: string | null;
  permissions: string[];
  scopes?: IUserScopes;
  createdAt?: string | null;
  lastLoginAt?: string | null;
  isActive?: boolean;
}

export interface IUserListItem {
  id: string | number;
  name: string;
  displayName?: string | null;
  username: string;
  role: UserRole;
  roles?: string[];
  roleIds?: string[];
  isSuperAdmin?: boolean;
  permissions: string[];
  scopes?: IUserScopes;
  createdAt: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

