import { Controller, Get, Header, HttpStatus, Res } from '@nestjs/common';

import { CsrfToken } from '@fc/csrf';
import { PartnersAccountSession } from '@fc/partners-account';
import { ISessionService, Session } from '@fc/session';

import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';
import { HttpErrorResponse, UserInfosInterface } from '../interfaces';

@Controller()
export class PartnersController {
  @Get(PartnersBackRoutes.CSRF_TOKEN)
  getCsrfToken(@CsrfToken() csrfToken: string): { csrfToken: string } {
    return { csrfToken };
  }

  @Get(PartnersBackRoutes.USER_INFO)
  @Header('cache-control', 'no-store')
  getUserInfo(
    @Res() res,
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<UserInfosInterface | HttpErrorResponse> {
    const userInfo = sessionPartnersAccount.get();

    if (!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const data = {
      ...userInfo?.identity,
      id: undefined,
      accountId: userInfo?.identity?.id,
      accessControl: userInfo?.accessControl,
    };

    return res.json(data);
  }

  @Get(PartnersBackRoutes.INDEX)
  getIndex(@Res() res): void {
    res.redirect(PartnersFrontRoutes.INDEX);
  }
}
