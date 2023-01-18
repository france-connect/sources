/* istanbul ignore file */

// declarative file
import { FSA } from '@fc/common';

import { ServiceProvidersActionTypes } from '../enums';
import { ServiceProvidersState, ServiceProviderState } from '../interfaces';

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
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_FAILED,
  };
}

export function serviceProviderEditRequested(): FSA {
  return {
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED,
  };
}

export function serviceProviderEditSuccessed(payload: Omit<ServiceProviderState, 'loading'>): FSA {
  return {
    payload,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_SUCCESSED,
  };
}

export function serviceProviderViewFailed(): FSA {
  return {
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_FAILED,
  };
}

export function serviceProviderViewRequested(): FSA {
  return {
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED,
  };
}

export function serviceProviderViewSuccessed(payload: Omit<ServiceProviderState, 'loading'>): FSA {
  return {
    payload,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_SUCCESSED,
  };
}
