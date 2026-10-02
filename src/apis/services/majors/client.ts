'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createMajorServices } from './_services';

export const clientMajorServices = createMajorServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
