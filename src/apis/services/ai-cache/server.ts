import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createAiCacheServices } from './_services';

export const serverAiCacheServices = createAiCacheServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
export type * from './_dto';
