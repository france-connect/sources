import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ISessionService, Session } from '@fc/session';

import {
  EidasProviderConfig,
  EidasProviderSession,
  RequestHandlerDTO,
} from './dto';
import { EidasProviderService } from './eidas-provider.service';

@Controller('eidas-provider')
export class EidasProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly eidasProvider: EidasProviderService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Temporary controller to handle the request
   * and send directly a preformatted response
   * @param body The body of the request, containing a light-request token
   * @returns The light-response token and the URL where it should be posted
   */
  @Post('/request-handler')
  @Redirect()
  async requestHandler(
    @Body()
    body: RequestHandlerDTO,
    @Session('EidasProvider')
    sessionEidasProvider: ISessionService<EidasProviderSession>,
  ) {
    const { token } = body;

    const lightRequest = await this.eidasProvider.readLightRequestFromCache(
      token,
    );

    const request = this.eidasProvider.parseLightRequest(lightRequest);

    await sessionEidasProvider.set('eidasRequest', request);

    const { redirectAfterRequestHandlingUrl } =
      this.config.get<EidasProviderConfig>('EidasProvider');

    return { statusCode: 302, url: redirectAfterRequestHandlingUrl };
  }

  @Get('/response-proxy')
  @Render('redirect-to-fr-node-proxy-service')
  async responseProxy(
    @Session('EidasProvider')
    session: ISessionService<EidasProviderSession>,
  ) {
    const eidasReponse = await this.getEidasResponse(session);

    const { lightResponse, token } =
      this.eidasProvider.prepareLightResponse(eidasReponse);

    await this.eidasProvider.writeLightResponseInCache(
      eidasReponse.id,
      lightResponse,
    );

    const { proxyServiceResponseCacheUrl } =
      this.config.get<EidasProviderConfig>('EidasProvider');

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
