import { ValidatorOptions } from 'class-validator';

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

import { validateDto } from '@fc/common';
import { CoreRoutes } from '@fc/core';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import {
  OidcProviderAuthorizeParamsException,
  OidcProviderService,
} from '@fc/oidc-provider';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto, ErrorParamsDto } from '../dto';
import { CoreFcpFailedAbortSessionException } from '../exceptions';

const validatorOptions: ValidatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  whitelist: true,
};

@Controller()
export class OidcProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
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
  async getAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Query() query: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      method: 'GET',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      query,
      route: OidcProviderRoutes.AUTHORIZATION,
    });

    // Initializes a new session local
    this.sessionService.reset(req, res);

    const errors = await validateDto(
      query,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new OidcProviderAuthorizeParamsException();
    }

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
  async postAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Body() body: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      body,
      method: 'POST',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      route: OidcProviderRoutes.AUTHORIZATION,
    });

    // Initializes a new session local
    this.sessionService.reset(req, res);

    const errors = await validateDto(
      body,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new OidcProviderAuthorizeParamsException();
    }

    // Pass the query to oidc-provider
    return next();
  }

  // A controller is an exception to the max-params lint due to decorators
  @Get(CoreRoutes.REDIRECT_TO_SP_WITH_ERROR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToSpWithError(
    @Query() { error, error_description: errorDescription }: ErrorParamsDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      await this.oidcProvider.abortInteraction(
        req,
        res,
        error,
        errorDescription,
      );
    } catch (error) {
      throw new CoreFcpFailedAbortSessionException(error);
    }
  }
}
