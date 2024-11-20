import { Request, Response } from 'express';
import { pick } from 'lodash';

import {
  Body,
  Controller,
  Header,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';

import { ApiContentType } from '@fc/app';
import {
  ChecktokenRequestDto,
  DataProviderRoutes,
  TokenIntrospectionInterface,
} from '@fc/core';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreFcpSession } from '../dto';
import { DataProviderExceptionFilter } from '../filters';
import { DataProviderService } from '../services';

@Controller()
export class DataProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly dataProviderService: DataProviderService,
    private readonly dataProviderAdapter: DataProviderAdapterMongoService,
    private readonly tracking: TrackingService,
  ) {}

  @UseFilters(DataProviderExceptionFilter)
  @Header('Content-Type', ApiContentType.INTROSPECTION)
  @Post(DataProviderRoutes.CHECKTOKEN)
  async checktoken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChecktokenRequestDto,
  ) {
    this.logger.debug({
      body: req.body,
      headers: req.headers,
      query: req.query,
    });

    await this.dataProviderService.checkRequestValid(body);

    const dataProvider =
      await this.dataProviderAdapter.getAuthenticatedDataProvider(
        body.client_id,
        body.client_secret,
      );

    const userSession = await this.dataProviderService.getSessionByAccessToken(
      body.token,
    );

    // 'token_introspection' follows the data structure describes in https://datatracker.ietf.org/doc/html/rfc7662.
    const tokenIntrospection =
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
    const jwt = await this.dataProviderService.generateJwt(
      tokenIntrospection,
      dataProvider,
    );

    const trackingContext = this.getTrackingContext(
      req,
      dataProvider,
      userSession,
    );
    await this.trackChecktokenJWT(tokenIntrospection, trackingContext);

    return res.status(HttpStatus.OK).end(jwt);
  }

  private getTrackingContext(
    req: Request,
    dataProvider: DataProviderMetadata,
    userSession: CoreFcpSession,
  ): TrackedEventContextInterface {
    const context = {
      req,
      dpId: dataProvider.uid,
      dpTitle: dataProvider.title,

      ...pick(userSession?.OidcClient, [
        'accountId',
        'browsingSessionId',
        'idpId',
        'idpName',
        'idpLabel',
        'idpAcr',
        'spId',
        'spName',
        'spAcr',
      ]),
    };

    return context;
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
