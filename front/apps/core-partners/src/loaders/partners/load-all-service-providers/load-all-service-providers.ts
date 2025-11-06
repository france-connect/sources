import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';
import type { ServiceProviderInterface } from '@fc/partners-service-providers';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig } from '../../../interfaces';

// @TODO #2356
// Implementing a DTO2Form config like
// Will allow to remove this loader
// https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2356
export const loadAllServiceProviders = async () => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { serviceProviders } = endpoints;

  const data =
    await fetchWithAuthHandling<FSAInterface<ServiceProviderInterface[]>>(serviceProviders);
  return data;
};
