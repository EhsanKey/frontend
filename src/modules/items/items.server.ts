import 'server-only';

import { serverItemServices } from '@/apis/services/items/server';
import { PAGE_SIZE } from '@/constants';
import { getSearchParamValue, toPositiveInteger } from '@/utils';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IItem } from '@/models';

export async function getItemsInitialData(
  searchParams: PageSearchParams,
): Promise<PaginatedResult<IItem>> {
  const page = toPositiveInteger(getSearchParamValue(searchParams, 'page')) ?? 1;
  const search = getSearchParamValue(searchParams, 'search') || undefined;
  const status = getSearchParamValue(searchParams, 'status') || undefined;
  const category = getSearchParamValue(searchParams, 'category') || undefined;

  try {
    return await serverItemServices.getItems({
      page,
      perPage: PAGE_SIZE,
      search,
      status,
      category,
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
