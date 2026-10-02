import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createErrorServices } from './_services';

export const serverErrorServices = createErrorServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
