import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createCampusServices } from './_services';

export const serverCampusServices = createCampusServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
