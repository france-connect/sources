import { IServiceProviderItem } from '@fc/partner-service-provider/interfaces';

import { Imeta } from '.';

export interface IServiceProviderList {
  meta: Imeta;
  payload: IServiceProviderItem[];
}
