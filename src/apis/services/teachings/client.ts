'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createTeachingServices } from './_services';

export const clientTeachingServices = createTeachingServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
