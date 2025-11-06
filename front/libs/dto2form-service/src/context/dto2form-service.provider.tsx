import { type PropsWithChildren, useCallback } from 'react';

import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import {
  createDTO2FormRouteLoaderFunc,
  getConfigEndpointsByIdHelper,
  getConfigFormByIdHelper,
} from '../helpers';
import type { Dto2FormServiceConfigInterface } from '../interfaces';
import { Dto2FormServiceContext } from './dto2form-service.context';

export const Dto2FormServiceProvider = ({ children }: Required<PropsWithChildren>) => {
  const config = ConfigService.get<Dto2FormServiceConfigInterface>(Options.CONFIG_NAME);

  const getConfigEndpointsById = useCallback(
    (id: string) => {
      const endpoints = getConfigEndpointsByIdHelper(id, config);
      return endpoints;
    },
    [config],
  );

  const getConfigFormById = useCallback(
    (id: string) => {
      const form = getConfigFormByIdHelper(id, config);
      return form;
    },
    [config],
  );

  const loadData = useCallback(
    (id: string) => {
      const endpoints = getConfigEndpointsByIdHelper(id, config);
      return createDTO2FormRouteLoaderFunc(endpoints);
    },
    [config],
  );

  return (
    <Dto2FormServiceContext.Provider
      value={{
        config,
        getConfigEndpointsById,
        getConfigFormById,
        loadData,
      }}>
      {children}
    </Dto2FormServiceContext.Provider>
  );
};
