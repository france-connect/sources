import { generatePath, useLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ExternalUrlsInterface, ServiceProviderInterface } from '@fc/core-partners';
import { CorePartnersOptions } from '@fc/core-partners';

export const useServiceProvider = () => {
  const { datapassBaseUrl, datapassHabilitationPathname } =
    ConfigService.get<ExternalUrlsInterface>(CorePartnersOptions.CONFIG_EXTERNAL_URLS);

  const response = useLoaderData();
  const { payload } = response as Required<FSAInterface<ServiceProviderInterface>>;

  const { datapassRequestId, datapassScopes, id, name, organizationName } = payload;
  const pathname = generatePath(datapassHabilitationPathname, {
    id: datapassRequestId,
  });
  const habilitationLink = `${datapassBaseUrl}${pathname}`;

  return {
    datapassRequestId,
    datapassScopes,
    habilitationLink,
    id,
    name,
    organizationName,
  };
};
