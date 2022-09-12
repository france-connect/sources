import { FSA } from '@fc/common';
import { InitialState } from '@fc/state-management';

import { ServiceProvidersActionTypes } from '../enums';
import { ServiceProvidersState } from '../interfaces';

export const ServiceProvidersFailed = (state: InitialState) => ({
  // @TODO find a way (immerjs ???)
  // - to scope the  state in param with the current reducer only
  ...state,
  ServiceProviders: {
    ...state.ServiceProviders,
    loading: false,
  },
});

export const ServiceProvidersRequested = (state: InitialState) => ({
  ...state,
  ServiceProviders: {
    ...state.ServiceProviders,
    loading: true,
  },
});

export const ServiceProvidersSuccessed = (state: InitialState, action: FSA) => {
  const { items, totalItems } = action.payload as Omit<ServiceProvidersState, 'loading'>;
  return {
    ...state,
    ServiceProviders: {
      items,
      loading: false,
      totalItems,
    },
  };
};

export const servicesProvidersReducers = {
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_FAILED]: ServiceProvidersFailed,
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED]: ServiceProvidersRequested,
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_SUCCESSED]: ServiceProvidersSuccessed,
};
