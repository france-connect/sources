import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
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
import { OidcProviderService } from './oidc-provider.service';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

@Controller()
export class OidcProviderController {
  constructor(
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
  ) {}

  @Get(OidcProviderRoutes.AUTHORIZATION_WITH_INTERACTION_ID)
  @Header('cache-control', 'no-store')
  async getAuthorize(@Req() req, @Res() res) {
    await this.oidcProvider.callback(req, res);
  }

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
  async postToken(@Req() req, @Res() res) {
    const { body, query, headers } = req;

    this.logger.debug({
      body,
      query,
      headers,
    });

    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
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
  async revokeToken(
    @Req() req,
    @Res() res,
    @Body() _body: RevocationTokenParamsDTO,
  ) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Get(OidcProviderRoutes.USERINFO)
  @Header('Content-Type', ApiContentType.JWT)
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  async getUserInfo(@Req() req, @Res() res) {
    const { body, query, headers } = req;

    this.logger.debug({
      body,
      query,
      headers,
    });
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Get(OidcProviderRoutes.END_SESSION)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getEndSession(
    @Req() req,
    @Res() res,
    @Query() _query: LogoutParamsDto,
  ) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Post(OidcProviderRoutes.END_SESSION_CONFIRMATION)
  async getEndSessionConfirmation(@Req() req, @Res() res) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Get(OidcProviderRoutes.END_SESSION_SUCCESS)
  async getEndSessionSuccess(@Req() req, @Res() res) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Get(OidcProviderRoutes.JWKS)
  @Header('Content-Type', ApiContentType.JWKS)
  @Header('cache-control', 'public, max-age=600')
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  async getJwks(@Req() req, @Res() res) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }

  @Get(OidcProviderRoutes.OPENID_CONFIGURATION)
  @Header('cache-control', 'public, max-age=600')
  @UseFilters(OidcProviderRenderedJsonExceptionFilter)
  async getOpenidConfiguration(@Req() req, @Res() res) {
    // Pass the query to oidc-provider
    await this.oidcProvider.callback(req, res);
  }
}
