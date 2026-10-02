import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createReviewServices } from './_services';

export const serverReviewServices = createReviewServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
