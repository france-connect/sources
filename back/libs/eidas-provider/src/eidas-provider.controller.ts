import { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import {
  ISessionRequest,
  ISessionResponse,
  ISessionService,
  Session,
  SessionService,
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  EidasProviderConfig,
  EidasProviderSession,
  RequestHandlerDTO,
} from './dto';
import { EidasProviderService } from './eidas-provider.service';
import { EidasProviderRoutes } from './enums';

@Controller(EidasProviderRoutes.BASE)
export class EidasProviderController {
  // Authorized for dependency injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly eidasProvider: EidasProviderService,
    private readonly tracking: TrackingService,
    private readonly session: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Temporary controller to handle the request
   * and send directly a preformatted response
   * @param body The body of the request, containing a light-request token
   * @returns The light-response token and the URL where it should be posted
   */
  @Post(EidasProviderRoutes.REQUEST_HANDLER)
  @Redirect()
  async requestHandler(
    @Req() req: ISessionRequest,
    @Res() res: ISessionResponse,
    @Body()
    body: RequestHandlerDTO,
  ) {
    await this.session.reset(req, res);

    /**
     * We need to bind the session after the reset to prevent using
     * the previous session, so we can't use the decorator.
     */
    const sessionEidasProvider =
      SessionService.getBoundSession<EidasProviderSession>(
        req,
        'EidasProvider',
      );

    const { token } = body;
    const { INCOMING_EIDAS_REQUEST } = this.tracking.TrackedEventsMap;
    const trackingContext: TrackedEventContextInterface = { req };

    await this.tracking.track(INCOMING_EIDAS_REQUEST, trackingContext);

    const lightRequest =
      await this.eidasProvider.readLightRequestFromCache(token);

    const request = this.eidasProvider.parseLightRequest(lightRequest);

    /**
     * @todo #1129 vérifier les données de la requête.
     * Si la lightrequest ajoute de nouvelles données,
     * on ne le voit pas.
     * Author: Arnaud PSA
     * Date: 12/10/2022
     */

    await sessionEidasProvider.set('eidasRequest', request);

    const { redirectAfterRequestHandlingUrl } =
      this.config.get<EidasProviderConfig>('EidasProvider');

    return { statusCode: 302, url: redirectAfterRequestHandlingUrl };
  }

  @Get(EidasProviderRoutes.RESPONSE_PROXY)
  @Render('redirect-to-fr-node-proxy-service')
  async responseProxy(
    @Req() req: Request,
    @Session('EidasProvider')
    session: ISessionService<EidasProviderSession>,
  ) {
    const { REDIRECTING_TO_EIDAS_FR_NODE } = this.tracking.TrackedEventsMap;
    const trackingContext = { req };
    const eidasReponse = await this.getEidasResponse(session);

    const { lightResponse, token } =
      this.eidasProvider.prepareLightResponse(eidasReponse);

    await this.eidasProvider.writeLightResponseInCache(
      eidasReponse.id,
      lightResponse,
    );

    const { proxyServiceResponseCacheUrl } =
      this.config.get<EidasProviderConfig>('EidasProvider');
    await this.tracking.track(REDIRECTING_TO_EIDAS_FR_NODE, trackingContext);

    return { proxyServiceResponseCacheUrl, token };
  }

  private async getEidasResponse(
    sessionEidas: ISessionService<EidasProviderSession>,
  ) {
    this.logger.debug('getEidasResponse()');

    const { eidasRequest, partialEidasResponse }: EidasProviderSession =
      await sessionEidas.get();

    this.logger.trace({ partialEidasResponse });

    let eidasReponse;
    if (!partialEidasResponse.status.failure) {
      eidasReponse = this.eidasProvider.completeFcSuccessResponse(
        partialEidasResponse,
        eidasRequest,
      );
    } else {
      eidasReponse = this.eidasProvider.completeFcFailureResponse(
        partialEidasResponse,
        eidasRequest,
      );
    }

    return eidasReponse;
  }
}
