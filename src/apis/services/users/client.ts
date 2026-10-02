'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createUserServices } from './_services';

export const clientUserServices = createUserServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
