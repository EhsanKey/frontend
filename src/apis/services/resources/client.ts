'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createResourceServices } from './_services';

export const clientResourceServices = createResourceServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
