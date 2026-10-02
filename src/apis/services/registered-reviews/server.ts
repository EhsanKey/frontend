import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createRegisteredReviewServices } from './_services';

export const serverRegisteredReviewServices = createRegisteredReviewServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
export type * from './_dto';
