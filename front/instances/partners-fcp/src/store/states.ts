/* istanbul ignore file */

// declarative file
import { serviceProviderItemState, serviceProvidersState } from '@fc/service-providers';

export const statesMap = {
  ...serviceProvidersState,
  ...serviceProviderItemState,
};
