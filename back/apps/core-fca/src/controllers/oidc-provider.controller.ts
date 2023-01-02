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

import { LoggerService } from '@fc/logger-legacy';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';

@Controller()
export class OidcProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionService,
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
  async getAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Query() query: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      route: OidcProviderRoutes.AUTHORIZATION,
      method: 'GET',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      query,
    });
    // Initializes a new session local
    await this.sessionService.reset(req, res);
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
  async postAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Body() body: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      route: OidcProviderRoutes.AUTHORIZATION,
      method: 'POST',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      body,
    });
    // Initializes a new session local
    await this.sessionService.reset(req, res);
    // Pass the query to oidc-provider
    return next();
  }
}
