import { FSA } from '@fc/common';
import { ConfigService } from '@fc/config';
import * as httpClient from '@fc/http-client';
import { SideEffectMap } from '@fc/state-management';

import { ServiceProvidersActionTypes, ServiceProvidersOptions } from '../enums';
import { ServiceProvidersConfig } from '../interfaces';
import { serviceProvidersFailed, serviceProvidersSuccessed } from './actions';

// @TODO defined a dispatch type
export const requestServiceProviders = async (action: FSA, dispatch: Function) => {
  try {
    const { endpoint } = ConfigService.get<ServiceProvidersConfig>(
      ServiceProvidersOptions.CONFIG_NAME,
    );
    const results = await httpClient.get(endpoint);
    const { meta, payload } = results.data;
    dispatch(
      serviceProvidersSuccessed({
        items: payload,
        totalItems: meta.totalItems,
      }),
    );
  } catch (err) {
    dispatch(serviceProvidersFailed());
  }
};

// sideEffects MUST be exported mapped by corresponding action type to be called later
export const serviceProvidersSideEffects: SideEffectMap = {
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED]: requestServiceProviders,
};
