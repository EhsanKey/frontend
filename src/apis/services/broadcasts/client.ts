'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createBroadcastsServices } from './_services';

export const clientBroadcastsServices = createBroadcastsServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
