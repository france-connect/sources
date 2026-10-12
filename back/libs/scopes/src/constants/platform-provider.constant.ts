import { PartnersPlatformEnum } from '@fc/partners-service-provider/enums';

import { fcpHigh, fcpLow } from '../data';

export const PlatformProviderMap: Record<PartnersPlatformEnum, string> = {
  [PartnersPlatformEnum.FRANCE_CONNECT_LOW]: fcpLow.provider.slug,
  [PartnersPlatformEnum.FRANCE_CONNECT_HIGH]: fcpHigh.provider.slug,
};
