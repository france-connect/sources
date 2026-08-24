import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import {
  Controller,
  Get,
  Header,
  MessageEvent,
  Param,
  Render,
  Req,
  Res,
  Sse,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  CONFIG_NAMESPACE,
  Openid4vpConfig,
  Openid4vpService,
} from '@fc/openid4vp';
import { QrcodeErrorCorrectionLevel, QrcodeService } from '@fc/qrcode';

import { QRCODE_WIDTH_PX } from '../constants';
import { AuthorizeRequestUriParamsDto } from '../dto';
import { WalletBridgeRoutes } from '../enums';
import { SseService, WalletBridgeIdentityService } from '../services';

@Controller()
export class OpenId4vpUiController {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly openid4vp: Openid4vpService,
    private readonly qrcode: QrcodeService,
    private readonly sse: SseService,
    private readonly identityService: WalletBridgeIdentityService,
  ) {}

  @Get(WalletBridgeRoutes.OIDC_INTERACTION)
  @Render('interaction')
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async authorizeRequestUri(
    @Param() { interactionId }: AuthorizeRequestUriParamsDto,
  ) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const {
      relayingParty: {
        interactionTtl,
        redirectDelay,
        requestUri: requestObjectUri,
      },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const interaction = await this.openid4vp.getInteractionById(interactionId);
    const requestUri = this.openid4vp.getAuthorizeRequestUri(interaction);

    const qrcodeDataUrl = await this.qrcode.generateDataUrl(requestUri, {
      errorCorrectionLevel: QrcodeErrorCorrectionLevel.LOW,
      margin: 0,
      width: QRCODE_WIDTH_PX,
    });

    return {
      requestUri,
      qrcodeDataUrl,
      successUrl: `${urlPrefix}${parameterizedPath(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REDIRECT, { interactionId })}`,
      statusUrl: `${urlPrefix}${parameterizedPath(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_STATUS, { interactionId })}`,
      timeout: interactionTtl,
      redirectDelay,
      httpRequestUri: parameterizedPath(requestObjectUri, { interactionId }),
    };
  }

  @Get(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REDIRECT)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async authorizeRedirect(
    @Param() { interactionId }: AuthorizeRequestUriParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const interaction =
      await this.openid4vp.getUserInteractionById(interactionId);

    await this.identityService.finishInteraction(req, res, interaction);
  }

  @Sse(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_STATUS)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  authorizeRequestStatus(
    @Param() { interactionId }: AuthorizeRequestUriParamsDto,
  ): Observable<MessageEvent> {
    return this.sse.buildSseStream(interactionId);
  }
}
