import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { ConfigService } from '@fc/config';
import * as HttpClientService from '@fc/http-client';

import { ServiceProvidersOptions } from '../../enums';
import {
  ServiceProviderConfigs,
  ServiceProviderConfigsItems,
  ServiceProviderConfigsPayload,
  ServiceProvidersConfig,
} from '../../interfaces';

export const useGetServiceProviderConfigs = (id: string) => {
  const [fetchedConfigs, setFetchedConfigs] = useState<ServiceProviderConfigsItems>();

  const onFetchConfigsSuccess = useCallback(({ data }: AxiosResponse<ServiceProviderConfigs>) => {
    const { meta, payload } = data;

    setFetchedConfigs({
      items: payload.map((configItem: ServiceProviderConfigsPayload) => ({
        id: configItem.payload.id,
        title: configItem.payload.name,
      })),
      total: meta.total,
    });
  }, []);

  const onFetchConfigsError = useCallback((err: Error) => {
    // eslint-disable-next-line no-console
    console.error('serviceProviderConfigs.onFetchConfigsError', err);
  }, []);

  useEffect(() => {
    const configName = ServiceProvidersOptions.CONFIG_NAME;
    const { endpoints } = ConfigService.get<ServiceProvidersConfig>(configName);
    const { serviceProvidersConfigs: url } = endpoints;
    const params = {
      serviceProviderId: id,
    };
    HttpClientService.get(url, {}, { params })
      .then(onFetchConfigsSuccess)
      .catch(onFetchConfigsError);
  }, [id, onFetchConfigsSuccess, onFetchConfigsError]);

  return {
    fetchedConfigs,
    onFetchConfigsError,
    onFetchConfigsSuccess,
  };
};
