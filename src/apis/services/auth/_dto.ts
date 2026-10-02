import type { UserRole } from '@/models';

export interface AuthUserDto {
  id: number | string;
  name: string;
  username: string;
  role: UserRole;
  roles?: string[];
  isSuperAdmin?: boolean;
  profileImageUrl?: string | null;
  permissions?: string[];
  createdAt?: string | null;
  lastLoginAt?: string | null;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken?: string;
  tokenType: 'Bearer';
  user: AuthUserDto;
}

export interface LogoutResponseDto {
  message: string;
}

export type GetMeResponseDto = AuthUserDto;
