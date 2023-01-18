import { FSA } from '@fc/common';
import { ConfigService } from '@fc/config';
import * as httpClient from '@fc/http-client';
import { SideEffectMap } from '@fc/state-management';

import { ServiceProvidersActionTypes, ServiceProvidersOptions } from '../enums';
import { ServiceProvidersConfig } from '../interfaces';
import {
  serviceProviderEditFailed,
  serviceProviderEditSuccessed,
  serviceProvidersFailed,
  serviceProvidersSuccessed,
  serviceProviderViewFailed,
  serviceProviderViewSuccessed,
} from './actions';

export const requestServiceProviders = async (action: FSA, dispatch: Function) => {
  try {
    // @TODO move this part into an service/utils file
    // like getServiceProvidersListURL(prefix: string)
    // it will takes a prefix arguement like </${id}/edit> or nothing
    const serviceName = ServiceProvidersOptions.CONFIG_NAME;
    const { endpoints } = ConfigService.get<ServiceProvidersConfig>(serviceName);
    const { serviceProviders } = endpoints;

    const { data } = await httpClient.get(serviceProviders);
    const { meta, payload } = data;

    dispatch(
      serviceProvidersSuccessed({
        items: payload,
        totalItems: meta.total,
      }),
    );
  } catch (err) {
    dispatch(serviceProvidersFailed());
  }
};

export const requestServiceProviderEdit = async ({ payload }: FSA, dispatch: Function) => {
  try {
    const { id } = payload as { id: string };

    // @TODO move this part into an service/utils file
    // like getServiceProvidersListURL(prefix: string)
    // it will takes a prefix arguement like </${id}/edit> or nothing
    const serviceName = ServiceProvidersOptions.CONFIG_NAME;
    const { endpoints } = ConfigService.get<ServiceProvidersConfig>(serviceName);
    const { serviceProviders } = endpoints;

    const url = `${serviceProviders}/${id}/edit`;

    const { data } = await httpClient.get(url);
    const { payload: item } = data;

    dispatch(
      serviceProviderEditSuccessed({
        item,
      }),
    );
  } catch (err) {
    dispatch(serviceProviderEditFailed());
  }
};

export const requestServiceProviderView = async ({ payload }: FSA, dispatch: Function) => {
  try {
    const { id } = payload as { id: string };

    // @TODO move this part into an service/utils file
    // like getServiceProvidersListURL(prefix: string)
    // it will takes a prefix arguement like </${id}/edit> or nothing
    const serviceName = ServiceProvidersOptions.CONFIG_NAME;
    const { endpoints } = ConfigService.get<ServiceProvidersConfig>(serviceName);
    const { serviceProviders } = endpoints;

    const url = `${serviceProviders}/${id}/view`;

    const results = await httpClient.get(url);
    const { payload: item } = results.data;

    dispatch(
      serviceProviderViewSuccessed({
        item,
      }),
    );
  } catch (err) {
    dispatch(serviceProviderViewFailed());
  }
};

// sideEffects MUST be exported mapped by corresponding action type to be called later
export const serviceProvidersSideEffects: SideEffectMap = {
  [ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED]: requestServiceProviders,
  [ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED]: requestServiceProviderEdit,
  [ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED]: requestServiceProviderView,
};
