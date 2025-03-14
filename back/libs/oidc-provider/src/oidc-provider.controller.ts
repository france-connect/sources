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
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiContentType } from '@fc/app';
import { ForbidRefresh } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session } from '@fc/session';

import { LogoutParamsDto, RevocationTokenParamsDTO } from './dto';
import { OidcProviderRoutes } from './enums';
import { OidcProviderRenderedJsonExceptionFilter } from './filters';
import { IOidcProviderConfigAppService } from './interfaces';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

@Controller()
export class OidcProviderController {
  constructor(
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
    private readonly logger: LoggerService,
  ) {}

  @Post(OidcProviderRoutes.REDIRECT_TO_SP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ForbidRefresh()
  async getLogin(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const session: OidcClientSession = sessionOidc.get();

    await this.oidcProviderConfigApp.finishInteraction(req, res, session);
  }

  @Post(OidcProviderRoutes.TOKEN)
  @Header('Content-Type', ApiContentType.JSON)
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  postToken(@Next() next, @Req() req) {
    const { body, query, headers } = req;

    this.logger.debug({
      body,
      query,
      headers,
    });

    // Pass the query to oidc-provider
    return next();
  }

  @Post(OidcProviderRoutes.REVOCATION)
  @Header('Content-Type', ApiContentType.JSON)
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
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
  @Header('Content-Type', ApiContentType.JWT)
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  getUserInfo(@Next() next, @Req() req) {
    const { body, query, headers } = req;

    this.logger.debug({
      body,
      query,
      headers,
    });
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
  @Header('Content-Type', ApiContentType.JWKS)
  @Header('cache-control', 'public, max-age=600')
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  getJwks(@Next() next) {
    // Pass the query to oidc-provider
    return next();
  }

  @Get(OidcProviderRoutes.OPENID_CONFIGURATION)
  @Header('cache-control', 'public, max-age=600')
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  getOpenidConfiguration(@Next() next) {
    // Pass the query to oidc-provider
    return next();
  }
}
