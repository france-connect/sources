import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { OidcProviderService } from '@fc/oidc-provider';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { ISessionService, Session } from '@fc/session';

import { AppSession, AuthorizeParamsDto } from '../dto';

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
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getAuthorize(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: AuthorizeParamsDto,
    @Session('App') appSession: ISessionService<AppSession>,
  ) {
    appSession.set('finalSpId', query.sp_id);

    await this.oidcProvider.callback(req, res);
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
    @Req() req: Request,
    @Res() res: Response,
    @Body() _body: AuthorizeParamsDto,
  ) {
    await this.oidcProvider.callback(req, res);
  }

  /**
   * This controller is used to make information available for testing purpose
   * by logging needed info.
   *
   * It then forward the request to `next` controller, in this case `oidc-provider`.
   */
  @Post(OidcProviderRoutes.TOKEN)
  async postToken(@Req() req: Request, @Res() res: Response, @Body() _body) {
    await this.oidcProvider.callback(req, res);
  }
}
