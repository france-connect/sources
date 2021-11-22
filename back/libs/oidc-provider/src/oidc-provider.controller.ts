import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session } from '@fc/session';

import { RevocationTokenParamsDTO } from './dto';
import { OidcProviderRoutes } from './enums';
import { OidcProviderService } from './oidc-provider.service';

@Controller()
export class OidcProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post(OidcProviderRoutes.REDIRECT_TO_SP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLogin(
    @Req() req,
    @Res() res,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const session: OidcClientSession = await sessionOidc.get();

    this.logger.trace({
      route: OidcProviderRoutes.REDIRECT_TO_SP,
      method: 'POST',
      name: 'OidcProviderRoutes.REDIRECT_TO_SP',
      req,
      res,
    });

    return this.oidcProvider.finishInteraction(req, res, session);
  }

  @Post(OidcProviderRoutes.TOKEN)
  postToken(@Next() next) {
    this.logger.trace({
      route: OidcProviderRoutes.TOKEN,
      method: 'POST',
      name: 'OidcProviderRoutes.TOKEN',
    });

    // Pass the query to oidc-provider
    return next();
  }

  @Post(OidcProviderRoutes.REVOCATION)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  revokeToken(@Next() next, @Body() _body: RevocationTokenParamsDTO) {
    this.logger.trace({
      route: OidcProviderRoutes.REVOCATION,
      method: 'POST',
      name: 'OidcProviderRoutes.REVOCATION',
      body: _body,
    });

    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.USERINFO)
  getUserInfo(@Next() next) {
    this.logger.trace({
      route: OidcProviderRoutes.USERINFO,
      method: 'GET',
      name: 'OidcProviderRoutes.USERINFO',
    });

    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.END_SESSION)
  getEndSession(@Next() next) {
    this.logger.trace({
      route: OidcProviderRoutes.END_SESSION,
      method: 'GET',
      name: 'OidcProviderRoutes.END_SESSION',
    });

    // Pass the query to oidc-provider
    return next();
  }
}
