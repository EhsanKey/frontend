import 'server-only';

import { serverUserServices } from '@/apis/services/users/server';
import { PAGE_SIZE } from '@/constants';
import { getSearchParamValue, toPositiveInteger } from '@/utils';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { UserListItem } from '@/apis/services/users';

export async function getUsersInitialData(
  searchParams: PageSearchParams,
): Promise<PaginatedResult<UserListItem>> {
  const page = toPositiveInteger(getSearchParamValue(searchParams, 'page')) ?? 1;
  const search = getSearchParamValue(searchParams, 'search') || undefined;

  try {
    return await serverUserServices.getUsers({
      page,
      perPage: PAGE_SIZE,
      search,
    });
  } catch {
    return {
      items: [],
      meta: {
        page,
        perPage: PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    };
  }
}
