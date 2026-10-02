'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createReviewServices } from './_services';

export const clientReviewServices = createReviewServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
