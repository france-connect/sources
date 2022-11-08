/* istanbul ignore file */

// declarative file
import { FSA } from '@fc/common';

import {
  ServiceProviderEditActionTypes,
  ServiceProvidersActionTypes,
  ServiceProviderViewActionTypes,
} from '../enums';
import { ServiceProviderItemState, ServiceProvidersState } from '../interfaces';

export function serviceProvidersFailed(): FSA {
  return {
    type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_FAILED,
  };
}

export function serviceProvidersRequested(): FSA {
  return {
    type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
  };
}

export function serviceProvidersSuccessed(payload: Omit<ServiceProvidersState, 'loading'>): FSA {
  return {
    payload,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_SUCCESSED,
  };
}

export function serviceProviderEditFailed(): FSA {
  return {
    type: ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_FAILED,
  };
}

export function serviceProviderEditRequested(): FSA {
  return {
    type: ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_REQUESTED,
  };
}

export function serviceProviderEditSuccessed(
  payload: Omit<ServiceProviderItemState, 'loading'>,
): FSA {
  return {
    payload,
    type: ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_SUCCESSED,
  };
}

export function serviceProviderViewFailed(): FSA {
  return {
    type: ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_FAILED,
  };
}

export function serviceProviderViewRequested(): FSA {
  return {
    type: ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_REQUESTED,
  };
}

export function serviceProviderViewSuccessed(
  payload: Omit<ServiceProviderItemState, 'loading'>,
): FSA {
  return {
    payload,
    type: ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_SUCCESSED,
  };
}
