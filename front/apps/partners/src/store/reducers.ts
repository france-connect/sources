import { FSA } from '@fc/common';
import { InitialState } from '@fc/state-management';

import {
  ServiceProviderEditActionTypes,
  ServiceProvidersActionTypes,
  ServiceProviderViewActionTypes,
} from '../enums';
import { ServiceProvidersState, ServiceProviderState } from '../interfaces';

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

export const ServiceProviderEditFailed = (state: InitialState) => ({
  ...state,
  ServiceProviderItem: {
    // @TODO: check what behavior is expected; in case of error
    error: 'An error has occured',
    loading: false,
  },
});

export const ServiceProviderEditRequested = (state: InitialState) => ({
  ...state,
  ServiceProviderItem: {
    ...state.ServiceProviderItem,
    item: undefined,
    loading: true,
  },
});

export const ServiceProviderEditSuccessed = (state: InitialState, action: FSA) => {
  const { item } = action.payload as Omit<ServiceProviderState, 'loading'>;

  return {
    ...state,
    ServiceProviderItem: {
      item,
      loading: false,
    },
  };
};

export const ServiceProviderViewFailed = (state: InitialState) => ({
  ...state,
  ServiceProviderItem: {
    // @TODO: check what behavior is expected; in case of error
    error: 'An error has occured',
    loading: false,
  },
});

export const ServiceProviderViewRequested = (state: InitialState) => ({
  ...state,
  ServiceProviderItem: {
    ...state.ServiceProviderItem,
    item: undefined,
    loading: true,
  },
});

export const ServiceProviderViewSuccessed = (state: InitialState, action: FSA) => {
  const { item } = action.payload as Omit<ServiceProviderState, 'loading'>;

  return {
    ...state,
    ServiceProviderItem: {
      item,
      loading: false,
    },
  };
};

export const servicesProvidersReducers = {
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_FAILED]: ServiceProvidersFailed,
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED]: ServiceProvidersRequested,
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_SUCCESSED]: ServiceProvidersSuccessed,
  [ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_FAILED]: ServiceProviderEditFailed,
  [ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_REQUESTED]: ServiceProviderEditRequested,
  [ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_SUCCESSED]: ServiceProviderEditSuccessed,
  [ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_FAILED]: ServiceProviderViewFailed,
  [ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_REQUESTED]: ServiceProviderViewRequested,
  [ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_SUCCESSED]: ServiceProviderViewSuccessed,
};
