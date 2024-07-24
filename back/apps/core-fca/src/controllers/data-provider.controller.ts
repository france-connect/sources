import { Request, Response } from 'express';

import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';

import {
  ChecktokenRequestDto,
  DataProviderRoutes,
  TokenIntrospectionInterface,
} from '@fc/core';
import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';

import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProviderService: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
  ) {}

  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChecktokenRequestDto,
  ) {
    let jwt: string;
    let tokenIntrospection: TokenIntrospectionInterface;

    try {
      await this.dataProviderService.checkRequestValid(body);

      const dataProvider =
        await this.dataProviderAdapter.getAuthenticatedDataProvider(
          body.client_id,
          body.client_secret,
        );

      const userSession =
        await this.dataProviderService.getSessionByAccessToken(body.token);

      // 'token_introspection' follows the data structure describes in https://datatracker.ietf.org/doc/html/rfc7662.
      tokenIntrospection =
        await this.dataProviderService.generateTokenIntrospection(
          userSession,
          body.token,
          dataProvider,
        );

      /**
       * Follows the draft spec https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-introspection-response-12,
       * an extension of the OAuth spec that allows returning signed and encrypted introspection tokens. This draft spec
       * addresses the need for stronger assurance and liability from the authorization server compared to the plain JSON
       * responses in the default spec. It is useful in scenarios requiring high security.
       *
       * This spec is recent and still draft, but we have no better options.
       */
      jwt = await this.dataProviderService.generateJwt(
        tokenIntrospection,
        dataProvider,
      );
    } catch (exception) {
      const {
        message,
        error = '',
        httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      } = exception;
      this.logger.crit({ error }, message);

      const result = this.dataProviderService.generateErrorMessage(
        httpStatusCode,
        message,
        error,
      );

      return res.status(httpStatusCode).json(result);
    }

    res.set('Content-Type', 'application/token-introspection+jwt');
    return res.status(HttpStatus.OK).end(jwt);
  }
}
