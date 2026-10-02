'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createTelegramServices } from './_services';

export const clientTelegramServices = createTelegramServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
