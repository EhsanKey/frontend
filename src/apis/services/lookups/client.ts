import { clientApiRequest } from '@/apis/core/client/api-request';
import { createLookupServices } from './_services';

export const lookupServices = createLookupServices(clientApiRequest);
