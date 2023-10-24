import { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { ISessionService, Session } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import {
  EidasClientConfig,
  EidasClientSession,
  EidasClientValidateEuropeanIdentity,
  ReponseHandlerDTO,
} from './dto';
import { EidasClientService } from './eidas-client.service';
import { EidasClientRoutes } from './enum';

@Controller(EidasClientRoutes.BASE)
export class EidasClientController {
  constructor(
    private readonly config: ConfigService,
    private readonly eidasClient: EidasClientService,
    private readonly tracking: TrackingService,
  ) {}

  /**
   * A temporary controller who format a hardcoded temporary request to a
   * light-request before writing it to an ignite cache and then returning
   * the informations for a form to call the FR Node.
   * @returns The light-request token and the URL where it should be posted
   */
  @Get(EidasClientRoutes.REDIRECT_TO_FR_NODE_CONNECTOR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('redirect-to-fr-node-connector')
  async redirectToFrNode(
    @Query()
    query: EidasClientValidateEuropeanIdentity,
    @Session('EidasClient')
    sessionEidas: ISessionService<EidasClientSession>,
  ) {
    const { eidasPartialRequest } = await sessionEidas.get();

    const eidasRequest = this.eidasClient.completeEidasRequest(
      eidasPartialRequest,
      query.country,
    );

    await sessionEidas.set('eidasRequest', eidasRequest);

    const { token, lightRequest } =
      this.eidasClient.prepareLightRequest(eidasRequest);

    await this.eidasClient.writeLightRequestInCache(
      eidasRequest.id,
      lightRequest,
    );

    const { connectorRequestCacheUrl } =
      this.config.get<EidasClientConfig>('EidasClient');

    return {
      connectorRequestCacheUrl,
      token,
    };
  }

  /**
   * Temporary controller to handle the response
   * @param body The body of the response, containing a light-response token
   * @returns The identity found in the light-response as a JSON
   */
  @Redirect()
  @Post(EidasClientRoutes.RESPONSE_HANDLER)
  async responseHandler(
    @Req() req: Request,
    @Body() body: ReponseHandlerDTO,
    @Session('EidasClient')
    sessionEidas: ISessionService<EidasClientSession>,
  ) {
    const trackingContext = { req };
    const { token } = body;
    const { INCOMING_EIDAS_RESPONSE } = this.tracking.TrackedEventsMap;
    await this.tracking.track(INCOMING_EIDAS_RESPONSE, trackingContext);

    const lightResponse = await this.eidasClient.readLightResponseFromCache(
      token,
    );

    const eidasResponse = this.eidasClient.parseLightResponse(lightResponse);

    await sessionEidas.set('eidasResponse', eidasResponse);

    const { redirectAfterResponseHandlingUrl } =
      this.config.get<EidasClientConfig>('EidasClient');

    return { url: redirectAfterResponseHandlingUrl, statusCode: 302 };
  }
}
