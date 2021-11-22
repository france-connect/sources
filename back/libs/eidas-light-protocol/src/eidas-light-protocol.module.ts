/* istanbul ignore file */

// Declarative code

/**
 * Eidas documentation
 * @see https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS+eID+Profile?preview=/82773108/148898847/eIDAS%20SAML%20Attribute%20Profile%20v1.2%20Final.pdf
 * @see https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eIDAS-Node+version+2.4?preview=/174391771/174391830/eIDAS-Node%20National%20IdP%20and%20SP%20Integration%20Guide%20v2.4.pdf
 */
import { Module } from '@nestjs/common';

import {
  LightProtocolCommonsService,
  LightProtocolXmlService,
  LightRequestService,
  LightResponseService,
} from './services';

@Module({
  providers: [
    LightRequestService,
    LightResponseService,
    LightProtocolCommonsService,
    LightProtocolXmlService,
  ],
  exports: [
    LightRequestService,
    LightResponseService,
    LightProtocolCommonsService,
    LightProtocolXmlService,
  ],
})
export class EidasLightProtocolModule {}
