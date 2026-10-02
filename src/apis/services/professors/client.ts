'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createProfessorServices } from './_services';

export const clientProfessorServices = createProfessorServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);
export type * from './_types';
