import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';
import type { InstanceInterface } from '@fc/partners-service-providers';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

// @TODO #2356
// The Dto2Form Back API should return
// the data and schema in a single response.
// the payload is not FSAInterface compliant (no type, no meta, no payload)
// https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
export const loadAllInstances = async () => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { instances } = endpoints;

  const data = await fetchWithAuthHandling<FSAInterface<InstanceInterface[]>>(instances);
  return data;
};
