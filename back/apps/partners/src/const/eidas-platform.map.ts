import { DatapassEidasLevels } from '@fc/datapass';

import { PartnersPlatformEnum } from '../enums/partners-platform.enum';

export const EidasPlatformMap = {
  [DatapassEidasLevels.EIDAS_1]: PartnersPlatformEnum.FRANCE_CONNECT_LOW,
  [DatapassEidasLevels.EIDAS_2]: PartnersPlatformEnum.FRANCE_CONNECT_HIGH,
  [DatapassEidasLevels.EIDAS_3]: PartnersPlatformEnum.FRANCE_CONNECT_HIGH,
};
