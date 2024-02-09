import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Next,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ForbidRefresh } from '@fc/flow-steps';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session } from '@fc/session';

import { LogoutParamsDto, RevocationTokenParamsDTO } from './dto';
import { OidcProviderRoutes } from './enums';
import { IOidcProviderConfigAppService } from './interfaces';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

@Controller()
export class OidcProviderController {
  constructor(
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
  ) {}

  @Post(OidcProviderRoutes.REDIRECT_TO_SP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ForbidRefresh()
  async getLogin(
    @Req() req,
    @Res() res,
    /**
     * @TODO #1018 Refactoriser la partie API du controller core-fca
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1018
     * @ticket FC-1018
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const session: OidcClientSession = await sessionOidc.get();

    return this.oidcProviderConfigApp.finishInteraction(req, res, session);
  }

  @Post(OidcProviderRoutes.TOKEN)
  postToken(@Next() next) {
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
    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.USERINFO)
  getUserInfo(@Next() next) {
    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.END_SESSION)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  getEndSession(@Next() next, @Query() _query: LogoutParamsDto) {
    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.JWKS)
  @Header('cache-control', 'public, max-age=600')
  getJwks(@Next() next) {
    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.OPENID_CONFIGURATION)
  @Header('cache-control', 'public, max-age=600')
  getOpenidConfiguration(@Next() next) {
    // Pass the query to oidc-provider
    return next();
  }
}
