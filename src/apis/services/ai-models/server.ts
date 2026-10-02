import 'server-only';

import { serverApiRequest } from '@/apis/core/server/api-request';
import { createAiModelServices } from './_services';

export const serverAiModelServices = createAiModelServices(serverApiRequest);
export type * from './_types';
