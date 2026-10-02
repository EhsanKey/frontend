import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createBroadcastsServices } from './_services';

export const serverBroadcastsServices = createBroadcastsServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
