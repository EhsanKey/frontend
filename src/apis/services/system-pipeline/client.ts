'use client';

import { clientApiRequest } from '@/apis/core/client/api-request';
import { createSystemPipelineServices } from './_services';

export const clientSystemPipelineServices = createSystemPipelineServices(clientApiRequest);
export type * from './_types';
