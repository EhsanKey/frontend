import 'server-only';

import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createCrawlerServices } from './_services';

export const serverCrawlerServices = createCrawlerServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);

export type * from './_types';
export type * from './_dto';
