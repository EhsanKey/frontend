import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createInquiriesServices } from './_services';

export const serverInquiriesServices = createInquiriesServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
