import type { LoaderFunction } from 'react-router';

import type { Dto2FormConfigInterface } from '@fc/dto2form';

import type { Dto2FormServiceFormConfigInterface } from './dto2form-service-config.interface';

export interface Dto2FormServiceContextInterface {
  config: Dto2FormConfigInterface;
  loadData: (name: string) => LoaderFunction;
  getConfigFormById: (name: string) => Dto2FormServiceFormConfigInterface['form'];
  getConfigEndpointsById: (name: string) => Dto2FormServiceFormConfigInterface['endpoints'];
}
