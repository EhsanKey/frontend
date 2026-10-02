import { QUERY_KEYS } from '@/constants';
import type { IItemFilterParams } from '@/models';

export const getItemsQueryKey = (params: IItemFilterParams) => {
  return QUERY_KEYS.items.list(params as Record<string, unknown>);
};
