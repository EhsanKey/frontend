'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createCrawlerServices } from './_services';

export const clientCrawlerServices = createCrawlerServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);

export type * from './_types';
export type * from './_dto';
