'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createRegisteredReviewServices } from './_services';

export const clientRegisteredReviewServices = createRegisteredReviewServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
export type * from './_dto';
