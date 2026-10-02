'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createInquiriesServices } from './_services';

export const clientInquiriesServices = createInquiriesServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
