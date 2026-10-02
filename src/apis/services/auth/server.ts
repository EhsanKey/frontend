import 'server-only';

import { serverApiRequest } from '@/apis/core/server/api-request';
import { createAuthServices } from './_services';

export const serverAuthServices = createAuthServices(serverApiRequest);
export type * from './_types';
