import {
  Body,
  Controller,
  Get,
  Header,
  Next,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreMissingIdentityException, CoreRoutes } from '@fc/core';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderRoutes, OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session } from '@fc/session';

import { AuthorizeParamsDto, GetLoginOidcClientSessionDto } from '../dto';

@Controller()
export class OidcProviderController {
  constructor(private readonly oidcProvider: OidcProviderService) {}

  /**
   * Authorize route via HTTP GET
   * Authorization endpoint MUST support GET method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Get(OidcProviderRoutes.AUTHORIZATION)
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @IsStep()
  getAuthorize(@Next() next, @Query() _query: AuthorizeParamsDto) {
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
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @IsStep()
  postAuthorize(@Next() next, @Body() _body: AuthorizeParamsDto) {
    // Pass the query to oidc-provider
    return next();
  }

  /**
   * @TODO #185 Remove this controller once it is globaly available in `@fc/oidc-provider`
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/185
   */
  @Get(CoreRoutes.INTERACTION_LOGIN)
  @Header('cache-control', 'no-store')
  @IsStep()
  @ForbidRefresh()
  getLogin(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetLoginOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { spIdentity } = sessionOidc.get();
    if (!spIdentity) {
      throw new CoreMissingIdentityException();
    }

    const session: OidcClientSession = sessionOidc.get();
    return this.oidcProvider.finishInteraction(req, res, session);
  }
}
