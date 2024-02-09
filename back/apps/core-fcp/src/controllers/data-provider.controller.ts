import { Response } from 'express';

import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { CustomJwtPayload } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionRequest, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { ChecktokenRequestDto } from '../dto';
import { DataProviderRoutes } from '../enums';
import { DpJwtPayloadInterface } from '../interfaces';
import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProvider: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
    private readonly session: SessionService,
    private readonly tracking: TrackingService,
  ) {}

  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Req() req: ISessionRequest,
    @Res() res: Response,
    @Body() bodyChecktokenRequest: ChecktokenRequestDto,
  ) {
    let jwt: string;
    let payload: CustomJwtPayload<DpJwtPayloadInterface>;
    let trackingContext: TrackedEventContextInterface;

    const {
      access_token: accessToken,
      client_id: clientId,
      client_secret: clientSecret,
    } = bodyChecktokenRequest;

    try {
      await this.dataProvider.checkRequestValid(bodyChecktokenRequest);

      const { uid: dpId, title: dpTitle } =
        await this.dataProviderAdapter.getAuthenticatedDataProvider(
          clientId,
          clientSecret,
        );

      trackingContext = {
        req,
        dpId,
        dpTitle,
      };

      const sessionId =
        await this.dataProvider.getSessionByAccessToken(accessToken);

      if (!sessionId) {
        payload = this.dataProvider.generateExpiredPayload(clientId);
      } else {
        req.sessionId = sessionId;
        req.sessionService = this.session;
        const oidcSessionService =
          SessionService.getBoundSession<OidcClientSession>(req, 'OidcClient');

        payload = await this.dataProvider.generatePayload(
          oidcSessionService,
          accessToken,
          clientId,
        );
      }

      jwt = await this.dataProvider.generateJwt(payload, clientId);
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
          dpClientId: clientId,
          req,
        });
      }

      const result = this.dataProvider.generateErrorMessage(
        httpStatusCode,
        message,
        error,
      );

      return res.status(httpStatusCode).json(result);
    }

    await this.trackChecktokenJWT(payload, trackingContext);

    res.set('Content-Type', 'application/token-introspection+jwt');
    return res.status(HttpStatus.OK).end(jwt);
  }

  private async trackChecktokenJWT(
    // oidc naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { token_introspection }: CustomJwtPayload<DpJwtPayloadInterface>,
    trackingContext: TrackedEventContextInterface,
  ): Promise<void> {
    const { active, scope } = token_introspection;

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
