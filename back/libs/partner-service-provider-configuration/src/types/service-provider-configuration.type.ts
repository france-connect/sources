import { FSA, FSAMeta } from '@fc/common';

import { ServiceProviderConfigurationItemInterface } from '../interfaces';

export type ServiceProviderConfigurationListType = {
  type: string;
  meta: FSAMeta;
  payload: FSA<
    Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>
  >[];
};
