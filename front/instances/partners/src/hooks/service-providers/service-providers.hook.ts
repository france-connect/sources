import { useLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { ServiceProviderInterface } from '@fc/partners-service-providers';

export const useServiceProviders = () => {
  const response = useLoaderData();

  const { payload: items } = response as Required<FSAInterface<ServiceProviderInterface[]>>;

  const hasItems = !!(items && items.length);
  return {
    hasItems,
    items,
  };
};
