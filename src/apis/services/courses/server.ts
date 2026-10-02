import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createCourseServices } from './_services';

export const serverCourseServices = createCourseServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
