'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createCourseServices } from './_services';

export const clientCourseServices = createCourseServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
