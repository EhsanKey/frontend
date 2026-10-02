'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createErrorServices } from './_services';

export const clientErrorServices = createErrorServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
