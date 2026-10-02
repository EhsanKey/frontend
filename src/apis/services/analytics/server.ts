import 'server-only';

import { serverApiRequest } from '@/apis/core/server/api-request';
import { createAnalyticsServices } from './_services';

export const serverAnalyticsServices = createAnalyticsServices(serverApiRequest);
export type * from './_types';
