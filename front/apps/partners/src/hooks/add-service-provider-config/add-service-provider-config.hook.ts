import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

import { ConfigService } from '@fc/config';
import * as HttpClientService from '@fc/http-client';

import { ServiceProvidersOptions } from '../../enums';
import {
  ServiceProviderConfig,
  ServiceProviderConfigsItems,
  ServiceProvidersConfig,
} from '../../interfaces';

export const useAddServiceProviderConfig = (id: string) => {
  const [configAdded, setConfigAdded] = useState<ServiceProviderConfigsItems>();

  const onAddConfigSuccess = useCallback((response: AxiosResponse<ServiceProviderConfig>) => {
    const { id: configId, name: configTitle } = response.data.payload;
    const { total } = response.data.meta;

    setConfigAdded({
      items: [
        {
          id: configId,
          title: configTitle,
        },
      ],
      total,
    });
  }, []);
  const onAddConfigError = useCallback((err: Error) => {
    // eslint-disable-next-line no-console
    console.error('serviceProviderConfigs.onAddConfigError', err);
  }, []);

  const addConfig = useCallback(() => {
    const configName = ServiceProvidersOptions.CONFIG_NAME;
    const { endpoints } = ConfigService.get<ServiceProvidersConfig>(configName);
    const { serviceProvidersConfigs: url } = endpoints;
    const params = {
      serviceProviderId: id,
    };

    HttpClientService.post(url, params).then(onAddConfigSuccess).catch(onAddConfigError);
  }, [id, onAddConfigSuccess, onAddConfigError]);

  return {
    addConfig,
    configAdded,
    onAddConfigError,
    onAddConfigSuccess,
  };
};
