import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createTeachingServices } from './_services';

export const serverTeachingServices = createTeachingServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
