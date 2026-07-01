import { useRouteLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { ServiceProviderInterface, ServiceProviderMetaInterface } from '@fc/core-partners';

export const useServiceProvider = () => {
  const {
    meta: { permissions },
    payload: serviceProvider,
  } = useRouteLoaderData('service-provider') as Required<
    FSAInterface<ServiceProviderInterface, ServiceProviderMetaInterface>
  >;

  return {
    permissions,
    serviceProvider,
  };
};
