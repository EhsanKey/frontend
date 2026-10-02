import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createUserServices } from './_services';

export const serverUserServices = createUserServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
