'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createAiCacheServices } from './_services';

export const clientAiCacheServices = createAiCacheServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
export type * from './_dto';
