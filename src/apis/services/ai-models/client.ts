'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createAiModelServices } from './_services';

export const clientAiModelServices = createAiModelServices(clientApiRequest);
export type * from './_types';
