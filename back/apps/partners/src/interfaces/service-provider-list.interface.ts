import { FSA, FSAMeta } from '@fc/common';
import { IServiceProviderItem } from '@fc/partner-service-provider';

import { Imeta } from '.';

export interface IServiceProviderList {
  meta: Imeta;
  payload: FSA<FSAMeta, IServiceProviderItem>[];
}
