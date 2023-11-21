import { Response } from 'express';
import { JWTPayload } from 'jose';

import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionRequest, SessionService } from '@fc/session';

import { ChecktokenRequestDto } from '../dto';
import { DataProviderRoutes } from '../enums';
import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProvider: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
    private readonly session: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Req() req: ISessionRequest,
    @Res() res: Response,
    @Body() bodyChecktokenRequest: ChecktokenRequestDto,
  ) {
    let jwt: string;

    try {
      await this.dataProvider.checkRequestValid(bodyChecktokenRequest);

      const {
        access_token: accessToken,
        client_id: clientId,
        client_secret: clientSecret,
      } = bodyChecktokenRequest;

      await this.dataProviderAdapter.checkAuthentication(
        clientId,
        clientSecret,
      );

      const sessionId =
        await this.dataProvider.getSessionByAccessToken(accessToken);

      let payload: JWTPayload;

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
      const { error, message, httpStatusCode } = exception;
      this.logger.debug(
        `POST checktoken error in data-provider-controller : ${exception}`,
      );
      const result = {
        error,
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: message,
      };
      return res.status(httpStatusCode).json(result);
    }

    return res.status(HttpStatus.OK).send(jwt);
  }
}
