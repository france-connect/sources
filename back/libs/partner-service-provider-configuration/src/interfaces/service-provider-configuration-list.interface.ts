/* istanbul ignore file */

// Declarative file
import { FSA, FSAMeta } from '@fc/common';

import { ServiceProviderConfigurationItemInterface } from './service-provider-configuration-item.interface';

export interface PartnerServiceProviderConfigurationListInterface {
  total: number;
  payload: FSA<
    FSAMeta,
    Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>
  >[];
}
