/* istanbul ignore file */

// Declarative file

import { uuid } from '@fc/common';
import { IServiceProviderItem } from '@fc/partner-service-provider';

import { EnvironmentEnum } from '../enums';

export interface ServiceProviderConfigurationItemInterface {
  id: uuid;
  name: string;
  environment: EnvironmentEnum;
  serviceProvider: IServiceProviderItem;
  createdAt: Date;
  updatedAt: Date;
}
