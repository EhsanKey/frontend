'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createCampusServices } from './_services';

export const clientCampusServices = createCampusServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
