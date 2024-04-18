import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { ISessionService, Session } from '@fc/session';

import { AppSession, AuthorizeParamsDto } from '../dto';

@Controller()
export class OidcProviderController {
  constructor() {}

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
  getAuthorize(
    @Next() next,
    @Query() query: AuthorizeParamsDto,
    @Session('App') appSession: ISessionService<AppSession>,
  ) {
    appSession.set('finalSpId', query.sp_id);

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
  postAuthorize(@Next() next, @Body() _body: AuthorizeParamsDto) {
    // Pass the query to oidc-provider
    return next();
  }

  /**
   * This controller is used to make information available for testing purpose
   * by logging needed info.
   *
   * It then forward the request to `next` controller, in this case `oidc-provider`.
   */
  @Post(OidcProviderRoutes.TOKEN)
  postToken(@Next() next, @Body() _body) {
    return next();
  }
}
