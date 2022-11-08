import { FSA } from '@fc/common';
import { ConfigService } from '@fc/config';
import * as httpClient from '@fc/http-client';
import { SideEffectMap } from '@fc/state-management';

import {
  ServiceProviderEditActionTypes,
  ServiceProvidersActionTypes,
  ServiceProvidersOptions,
  ServiceProviderViewActionTypes,
} from '../enums';
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
    const { endpoint } = ConfigService.get<ServiceProvidersConfig>(
      ServiceProvidersOptions.CONFIG_NAME,
    );
    const results = await httpClient.get(endpoint);
    const { meta, payload } = results.data;

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
    const { endpoint } = ConfigService.get<ServiceProvidersConfig>(
      ServiceProvidersOptions.CONFIG_NAME,
    );
    const {
      data: { payload: item },
    } = await httpClient.get(`${endpoint}/${id}/edit`);

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
    const { endpoint } = ConfigService.get<ServiceProvidersConfig>(
      ServiceProvidersOptions.CONFIG_NAME,
    );
    const {
      data: { payload: item },
    } = await httpClient.get(`${endpoint}/${id}/view`);

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
  [ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_REQUESTED]: requestServiceProviderEdit,
  [ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_REQUESTED]: requestServiceProviderView,
};
