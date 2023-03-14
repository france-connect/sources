import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreMissingIdentityException, CoreRoutes } from '@fc/core';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderRoutes, OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session, SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';

@Controller()
export class OidcProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionService,
    private readonly oidcProvider: OidcProviderService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Authorize route via HTTP GET
   * Authorization endpoint MUST support GET method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Get(OidcProviderRoutes.AUTHORIZATION)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getAuthorize(@Next() next, @Query() query: AuthorizeParamsDto) {
    this.logger.trace({
      route: OidcProviderRoutes.AUTHORIZATION,
      method: 'GET',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      query,
    });
    // Pass the query to oidc-provider
    return next();
  }

  /**
   * Authorize route via HTTP POST
   * Authorization endpoint MUST support POST method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Post(OidcProviderRoutes.AUTHORIZATION)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async postAuthorize(@Next() next, @Body() body: AuthorizeParamsDto) {
    this.logger.trace({
      route: OidcProviderRoutes.AUTHORIZATION,
      method: 'POST',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      body,
    });
    // Pass the query to oidc-provider
    return next();
  }

  /**
   * @TODO #185 Remove this controller once it is globaly available in `@fc/oidc-provider`
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/185
   */
  @Get(CoreRoutes.INTERACTION_LOGIN)
  async getLogin(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { spIdentity } = await sessionOidc.get();
    if (!spIdentity) {
      this.logger.trace(
        { route: CoreRoutes.INTERACTION_LOGIN },
        LoggerLevelNames.WARN,
      );
      throw new CoreMissingIdentityException();
    }

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION_LOGIN',
      route: CoreRoutes.INTERACTION_LOGIN,
      spIdentity,
    });

    const session: OidcClientSession = await sessionOidc.get();
    return this.oidcProvider.finishInteraction(req, res, session);
  }
}
