import 'server-only';

import { serverApiRequest } from '@/apis/core/server/api-request';
import { createSystemPipelineServices } from './_services';

export const serverSystemPipelineServices = createSystemPipelineServices(serverApiRequest);
export type * from './_types';
