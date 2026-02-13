import { Controller, Get, Header, Res } from '@nestjs/common';

import { CsrfToken } from '@fc/csrf';
import { PartnersAccountSession } from '@fc/partners-account';
import { ISessionService, Session } from '@fc/session';

import {
  AccessControlEntity,
  AccessControlPermission,
  PartnersBackRoutes,
  PartnersFrontRoutes,
} from '../enums';
import { HttpErrorResponse, UserInfosInterface } from '../interfaces';

@Controller()
export class PartnersController {
  @Get(PartnersBackRoutes.CSRF_TOKEN)
  getCsrfToken(@CsrfToken() csrfToken: string): { csrfToken: string } {
    return { csrfToken };
  }

  // eslint-disable-next-line complexity
  @Get(PartnersBackRoutes.USER_INFO)
  @Header('cache-control', 'no-store')
  /**
   * @todo FC-2184 ⚠️
   */
  getUserInfo(
    @Res() res,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<UserInfosInterface | HttpErrorResponse> {
    const userInfo = sessionPartnersAccount.get();

    const data = {
      ...userInfo?.identity,
      id: undefined,
      accountId: userInfo?.identity?.id,
      permissions: userInfo?.permissions,
    };

    return res.json(data);
  }

  @Get(PartnersBackRoutes.INDEX)
  getIndex(@Res() res): void {
    res.redirect(PartnersFrontRoutes.INDEX);
  }
}
