import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createTelegramServices } from './_services';

export const serverTelegramServices = createTelegramServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
