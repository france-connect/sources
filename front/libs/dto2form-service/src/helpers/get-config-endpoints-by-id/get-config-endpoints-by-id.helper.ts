import { get } from 'lodash';

import type { Dto2FormConfigInterface } from '@fc/dto2form';

import type { Dto2FormServiceEndpointsInterface } from '../../interfaces';

export const getConfigEndpointsByIdHelper = (
  id: string,
  config: Dto2FormConfigInterface,
): Dto2FormServiceEndpointsInterface => {
  const endpoints = get(config, [id, 'endpoints']);

  if (!endpoints) {
    const msg = `Endpoints for id "${id}" not found in configuration.`;
    throw new Error(msg);
  }

  return endpoints;
};
