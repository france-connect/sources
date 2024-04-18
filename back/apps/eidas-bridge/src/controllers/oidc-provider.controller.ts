import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Header,
  Next,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';

@Controller()
export class OidcProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly session: SessionService,
  ) {}

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
  async getAuthorize(
    @Res() res: Response,
    @Next() next,
    @Query() _query: AuthorizeParamsDto,
  ) {
    await this.session.reset(res);
    this.logger.info('Session was reset');

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
  postAuthorize(@Next() next, @Body() _body: AuthorizeParamsDto) {
    // Pass the query to oidc-provider
    return next();
  }
}
