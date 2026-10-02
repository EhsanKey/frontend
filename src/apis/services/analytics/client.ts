'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createAnalyticsServices } from './_services';

export const clientAnalyticsServices = createAnalyticsServices(clientApiRequest);
export type * from './_types';
