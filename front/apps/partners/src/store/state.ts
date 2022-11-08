/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { ServiceProvidersState, ServiceProviderState } from '../interfaces';

export const serviceProvidersState: GlobalState<ServiceProvidersState> = {
  ServiceProviders: {
    blacklist: true,
    defaultValue: {
      items: [],
      loading: false,
      totalItems: 0,
    },
  },
};

export const serviceProviderState: GlobalState<ServiceProviderState> = {
  ServiceProviderItem: {
    blacklist: true,
    defaultValue: {
      item: undefined,
      loading: false,
    },
  },
};
