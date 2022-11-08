/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { ServiceProviderItemState, ServiceProvidersState } from '../interfaces';

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

export const serviceProviderItemState: GlobalState<ServiceProviderItemState> = {
  ServiceProviderItem: {
    blacklist: true,
    defaultValue: {
      item: undefined,
      loading: false,
    },
  },
};
