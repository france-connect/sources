import { Request, Response } from 'express';

import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';

import {
  ChecktokenRequestDto,
  DataProviderRoutes,
  TokenIntrospectionInterface,
} from '@fc/core';
import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProviderService: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
    private readonly tracking: TrackingService,
  ) {}

  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChecktokenRequestDto,
  ) {
    let jwt: string;
    let tokenIntrospection: TokenIntrospectionInterface;
    let trackingContext: TrackedEventContextInterface;

    try {
      await this.dataProviderService.checkRequestValid(body);

      const dataProvider =
        await this.dataProviderAdapter.getAuthenticatedDataProvider(
          body.client_id,
          body.client_secret,
        );

      trackingContext = {
        req,
        dpId: dataProvider.uid,
        dpTitle: dataProvider.title,
      };

      const userSession =
        await this.dataProviderService.getSessionByAccessToken(body.token);

      if (userSession) {
        const {
          OidcClient: {
            accountId,
            browsingSessionId,
            idpId,
            idpName,
            idpLabel,
            idpAcr,
            spId,
            spName,
            spAcr,
          },
        } = userSession;
        trackingContext = {
          ...trackingContext,
          accountId,
          browsingSessionId,
          idpId,
          idpName,
          idpLabel,
          idpAcr,
          spId,
          spName,
          spAcr,
        };
      }

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

      if (httpStatusCode === HttpStatus.UNAUTHORIZED) {
        const { DP_USED_INVALID_CREDENTIAL } = this.tracking.TrackedEventsMap;
        await this.tracking.track(DP_USED_INVALID_CREDENTIAL, {
          dpClientId: body.client_id,
          req,
        });
      }

      const result = this.dataProviderService.generateErrorMessage(
        httpStatusCode,
        message,
        error,
      );

      return res.status(httpStatusCode).json(result);
    }

    await this.trackChecktokenJWT(tokenIntrospection, trackingContext);

    res.set('Content-Type', 'application/token-introspection+jwt');
    return res.status(HttpStatus.OK).end(jwt);
  }

  private async trackChecktokenJWT(
    tokenIntrospection: TokenIntrospectionInterface,
    trackingContext: TrackedEventContextInterface,
  ): Promise<void> {
    const { active, scope } = tokenIntrospection;

    if (active) {
      const { DP_VERIFIED_FC_CHECKTOKEN } = this.tracking.TrackedEventsMap;
      await this.tracking.track(DP_VERIFIED_FC_CHECKTOKEN, {
        scope,
        ...trackingContext,
      });
    } else {
      const { DP_USED_INVALID_ACCESS_TOKEN } = this.tracking.TrackedEventsMap;
      await this.tracking.track(DP_USED_INVALID_ACCESS_TOKEN, trackingContext);
    }
  }
}
