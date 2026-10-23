import { ConfigService } from '@fc/config';
import { get } from '@fc/http-client';

import type { NexusConfigInterface, NexusStatusInterface } from '../../interfaces';

export const loadStatus = async () => {
  const { apiRouteStatus } = ConfigService.get<NexusConfigInterface>('Nexus');

  const response = await get<NexusStatusInterface>(apiRouteStatus);

  return response;
};
