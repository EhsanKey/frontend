'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createUniversityServices } from './_services';

export const clientUniversityServices = createUniversityServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
