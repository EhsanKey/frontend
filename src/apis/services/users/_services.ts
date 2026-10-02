import { USERS_ENDPOINTS } from './_endpoints';
import {
  toPermissionModel,
  toRoleModel,
  toUserListItem,
  toUserModel,
} from './_mappers';
import type {
  CreateRoleDto,
  CreateUserDto,
  PermissionDto,
  RoleDto,
  UpdateUserDto,
  UserDto,
} from './_dto';
import type { GetUsersParams, UserListItem } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IPermission, IRole, IUser } from '@/models';

export function createUserServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getUsers(
    params?: GetUsersParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<UserListItem>> {
    const result = await paginatedRequest<UserDto>({
      url: USERS_ENDPOINTS.users,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toUserListItem),
      meta: result.meta,
    };
  }

  async function getUserById(
    id: string | number,
    signal?: AbortSignal,
  ): Promise<IUser> {
    const dto = await request<UserDto>({
      url: USERS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toUserModel(dto);
  }

  async function createUser(payload: CreateUserDto): Promise<UserListItem> {
    const dto = await request<UserDto, CreateUserDto>({
      url: USERS_ENDPOINTS.users,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toUserListItem(dto);
  }

  async function updateUser(
    id: string | number,
    payload: UpdateUserDto,
  ): Promise<UserListItem> {
    const dto = await request<UserDto, UpdateUserDto>({
      url: USERS_ENDPOINTS.detail(id),
      method: 'PUT',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toUserListItem(dto);
  }

  async function getRoles(signal?: AbortSignal): Promise<IRole[]> {
    const dtoArray = await request<RoleDto[]>({
      url: USERS_ENDPOINTS.roles,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return (dtoArray || []).map(toRoleModel);
  }

  async function createRole(payload: CreateRoleDto): Promise<IRole> {
    const dto = await request<RoleDto, CreateRoleDto>({
      url: USERS_ENDPOINTS.roles,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toRoleModel(dto);
  }

  async function getPermissions(signal?: AbortSignal): Promise<IPermission[]> {
    const dtoArray = await request<PermissionDto[]>({
      url: USERS_ENDPOINTS.permissions,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return (dtoArray || []).map(toPermissionModel);
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    getRoles,
    createRole,
    getPermissions,
  };
}
