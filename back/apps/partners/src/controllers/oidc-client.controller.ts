import { Request, Response } from 'express';

import {
  Controller,
  Get,
  Header,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { OidcClientRoutes } from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';
import { PartnersOidcClientService } from '../services';

@Controller()
export class OidcClientController {
  constructor(
    private readonly session: SessionService,
    private readonly oidcClient: PartnersOidcClientService,
  ) {}

  @Get(OidcClientRoutes.REDIRECT_TO_IDP)
  @Header('cache-control', 'no-store')
  async redirectToIdp(@Res() res: Response): Promise<void> {
    const authorizationUrl = await this.oidcClient.getAuthorizeUrl();

    res.redirect(authorizationUrl);
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOidcCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const identity = await this.oidcClient.getIdentityFromIdp(req);

    await this.oidcClient.retrieveOrCreateAccount(identity);

    res.redirect(PartnersFrontRoutes.INDEX);
  }

  @Get(PartnersBackRoutes.LOGOUT)
  @Header('cache-control', 'no-store')
  async logout(@Res() res: Response): Promise<void> {
    const endSessionUrl = await this.oidcClient.getLogoutUrl();

    res.redirect(endSessionUrl);
  }

  @Get(PartnersBackRoutes.LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  async logoutCallback(@Res() res: Response): Promise<void> {
    await this.session.reset(res);

    res.redirect(PartnersFrontRoutes.INDEX);
  }
}
