/* istanbul ignore file */

// declarative file
import { FSA } from '@fc/common';

import { ServiceProvidersActionTypes } from '../enums';
import { ServiceProvidersState } from '../interfaces';

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
