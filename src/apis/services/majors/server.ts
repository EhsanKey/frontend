import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createMajorServices } from './_services';

export const serverMajorServices = createMajorServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
