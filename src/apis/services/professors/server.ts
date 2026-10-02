import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createProfessorServices } from './_services';

export const serverProfessorServices = createProfessorServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
export type * from './_types';
