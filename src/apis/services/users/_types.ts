import type { IUserListItem } from '@/models';

export interface GetUsersParams {
  page?: number;
  perPage?: number;
  pageSize?: number;
  limit?: number;
  search?: string;
  q?: string;
}

export type UserListItem = IUserListItem;
export type { CreateRoleDto, CreateUserDto } from './_dto';
