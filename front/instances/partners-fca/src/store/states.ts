/* istanbul ignore file */

// declarative file
import { serviceProvidersState, serviceProviderState } from '@fc/partners';

export const statesMap = {
  ...serviceProvidersState,
  ...serviceProviderState,
};
