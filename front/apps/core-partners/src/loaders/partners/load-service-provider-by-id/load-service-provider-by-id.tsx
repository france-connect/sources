import type { LoaderFunctionArgs } from 'react-router';
import { generatePath } from 'react-router';

import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { fetchWithAuthHandling } from '@fc/http-client';

import { CorePartnersOptions } from '../../../enums';
import type { PartnersConfig, ServiceProviderInterface } from '../../../interfaces';

export const loadServiceProviderById = async ({ params }: LoaderFunctionArgs) => {
  const { endpoints } = ConfigService.get<PartnersConfig>(CorePartnersOptions.CONFIG_NAME);
  const { serviceProvider } = endpoints;

  const path = generatePath(serviceProvider, { id: params.serviceProviderId });

  const data = await fetchWithAuthHandling<FSAInterface<ServiceProviderInterface>>(path);
  return data;
};
