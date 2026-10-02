'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createItemServices } from './_services';

export const clientItemServices = createItemServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
