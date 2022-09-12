/* istanbul ignore file */

// declarative file
import { GlobalState } from '@fc/state-management';

import { ServiceProvidersState } from '../interfaces';

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
