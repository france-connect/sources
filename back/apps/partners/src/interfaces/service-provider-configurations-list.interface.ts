import { FSA, FSAMeta } from '@fc/common';
import { ServiceProviderConfigurationItemInterface } from '@fc/partner-service-provider-configuration';

export interface ServiceProviderConfigurationListInterface {
  type: string;
  meta: FSAMeta;
  payload: FSA<
    FSAMeta,
    Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>
  >[];
}
