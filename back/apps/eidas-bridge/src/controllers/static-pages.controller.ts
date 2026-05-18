import { Controller, Get, Header, Res } from '@nestjs/common';

import { EidasBridgeRoutes } from '../enums';

@Controller()
export class StaticPagesController {
  @Get(EidasBridgeRoutes.LEGAL_NOTICE)
  @Header('cache-control', 'no-store')
  getLegalNotice(@Res() res) {
    return res.render('legal-notice');
  }
}
