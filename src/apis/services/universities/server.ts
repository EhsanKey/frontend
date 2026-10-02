import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createUniversityServices } from './_services';

export const serverUniversityServices = createUniversityServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
