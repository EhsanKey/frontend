import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createItemServices } from './_services';

export const serverItemServices = createItemServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
