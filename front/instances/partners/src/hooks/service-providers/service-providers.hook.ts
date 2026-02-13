import { useLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { ServiceProviderItemInterface } from '@fc/core-partners';

export const useServiceProviders = () => {
  const response = useLoaderData();

  const { payload: items } = response as Required<FSAInterface<ServiceProviderItemInterface[]>>;

  const hasItems = !!(items && items.length);
  return {
    hasItems,
    items,
  };
};
