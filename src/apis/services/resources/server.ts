import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createResourceServices } from './_services';

export const serverResourceServices = createResourceServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
