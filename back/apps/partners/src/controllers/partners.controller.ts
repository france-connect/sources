import { Controller, Get, Header, HttpStatus, Res } from '@nestjs/common';

import { CsrfToken } from '@fc/csrf';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session } from '@fc/session';

import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';
import { AgentIdentityInterface } from '../interfaces';

@Controller()
export class PartnersController {
  constructor() {}

  @Get(PartnersBackRoutes.CSRF_TOKEN)
  getCsrfToken(@CsrfToken() csrfToken: string): { csrfToken: string } {
    return { csrfToken };
  }

  @Get(PartnersBackRoutes.USER_INFO)
  @Header('cache-control', 'no-store')
  getUserInfo(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): any {
    const idpIdentity = sessionOidc.get(
      'idpIdentity',
    ) as AgentIdentityInterface;

    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const {
      given_name: firstname,
      usual_name: lastname,
      email,
      siret,
      sub,
    } = idpIdentity;

    const userInfos = {
      firstname,
      lastname,
      email,
      siret,
      sub,
    };

    return res.json(userInfos);
  }

  @Get(PartnersBackRoutes.INDEX)
  getIndex(@Res() res): void {
    res.redirect(PartnersFrontRoutes.INDEX);
  }
}
