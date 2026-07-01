import { Response } from 'express';

import {
  Controller,
  Get,
  Param,
  Render,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EudiPresentationId } from '@fc/eudi';
import {
  CONFIG_NAMESPACE,
  Openid4vpConfig,
  Openid4vpService,
} from '@fc/openid4vp';
import { QrcodeService } from '@fc/qrcode';

import { AuthorizeRequestUriParamsDto } from '../dto';
import { Routes } from '../enums';

@Controller()
export class OpenId4vpUiController {
  constructor(
    private readonly config: ConfigService,
    private readonly openid4vp: Openid4vpService,
    private readonly qrcode: QrcodeService,
  ) {}

  @Get(Routes.OPENID4VP_AUTHORIZE_CREATE_INTERACTION)
  async authorizeRequest(@Res() res: Response) {
    const { urlPrefix } = this.config.get<AppConfig>('App');

    const request = this.openid4vp.getRequestById(EudiPresentationId.PID_FC);

    const interactionId =
      await this.openid4vp.createAuthorizationRequest(request);

    const qrRequestUri = `${urlPrefix}${parameterizedPath(Routes.OPENID4VP_AUTHORIZE_REQUEST_URI, { interactionId })}`;

    return res.redirect(qrRequestUri);
  }

  @Get(Routes.OPENID4VP_AUTHORIZE_REQUEST_URI)
  @Render('interaction')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async authorizeRequestUri(
    @Param() { interactionId }: AuthorizeRequestUriParamsDto,
  ) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const {
      relayingParty: { interactionTtl },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const interaction = await this.openid4vp.getInteractionById(interactionId);
    const requestUri = this.openid4vp.getAuthorizeRequestUri(interaction);

    const qrcodeDataUrl = await this.qrcode.generateDataUrl(requestUri, {
      errorCorrectionLevel: 'H',
    });

    return {
      requestUri,
      qrcodeDataUrl,
      successUrl: `${urlPrefix}${parameterizedPath(Routes.OPENID4VP_AUTHORIZE_REDIRECT, { interactionId })}`,
      statusUrl: `${urlPrefix}${parameterizedPath(Routes.OPENID4VP_AUTHORIZE_REQUEST_STATUS, { interactionId })}`,
      timeout: interactionTtl,
      httpRequestUri: new URL(requestUri).searchParams.get('request_uri'),
    };
  }

  @Get(Routes.OPENID4VP_AUTHORIZE_REDIRECT)
  authorizeRedirect() {
    return 'Hello World';
  }

  @Get(Routes.OPENID4VP_AUTHORIZE_REQUEST_STATUS)
  authorizeRequestStatus() {
    return 'Hello World';
  }
}
