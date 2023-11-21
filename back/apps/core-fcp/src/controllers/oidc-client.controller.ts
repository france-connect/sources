import { Request, Response } from 'express';
import { encode } from 'querystring';

import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreVerifyService, ProcessCore } from '@fc/core';
import { CryptographyService } from '@fc/cryptography';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  GetOidcCallback,
  OidcClientConfigService,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionService,
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  AppConfig,
  GetOidcCallbackOidcClientSessionDto,
  GetOidcCallbackSessionDto,
  GetRedirectToIdpOidcClientSessionDto,
  OidcIdentityDto,
} from '../dto';
import { CoreFcpInvalidIdentityException } from '../exceptions';
import { IIdentityCheckFeatureHandler } from '../interfaces';
import { CoreFcpService } from '../services';

@Controller()
export class OidcClientController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcClient: OidcClientService,
    private readonly oidcClientConfig: OidcClientConfigService,
    private readonly coreFcp: CoreFcpService,
    private readonly oidcProvider: OidcProviderService,
    private readonly csrfService: SessionCsrfService,
    private readonly config: ConfigService,
    private readonly coreVerify: CoreVerifyService,
    private readonly tracking: TrackingService,
    private readonly sessionService: SessionService,
    private readonly crypto: CryptographyService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  async redirectToIdp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RedirectToIdp,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetRedirectToIdpOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { csrfToken, providerUid: idpId } = body;

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    const {
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      params: { acr_values: acr },
    } = await this.oidcProvider.getInteraction(req, res);

    await this.coreFcp.redirectToIdp(res, acr, idpId, sessionOidc);
  }

  /**
   * @TODO #141 implement proper well-known
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/141
   *  - generated by openid-client
   *  - pub keys orverrided by keys from HSM
   */
  @Get(OidcClientRoutes.WELL_KNOWN_KEYS)
  @Header('cache-control', 'public, max-age=600')
  async getWellKnownKeys() {
    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.WELL_KNOWN_KEYS',
      route: OidcClientRoutes.WELL_KNOWN_KEYS,
    });
    return await this.oidcClient.utils.wellKnownKeys();
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK_LEGACY)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Redirect()
  getLegacyOidcCallback(@Query() query, @Param() params: GetOidcCallback) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const queryParams = encode(query);

    const response = {
      statusCode: 302,
      url: `${urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}?${queryParams}`,
    };

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK_LEGACY',
      providerUid: params.providerUid,
    });

    return response;
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @IsStep()
  @ForbidRefresh()
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetOidcCallbackOidcClientSessionDto)
    _sessionOidc: ISessionService<OidcClientSession>,
  ) {
    await this.sessionService.detach(req, res);
    await this.sessionService.duplicate(req, res, GetOidcCallbackSessionDto);

    const newSessionOidc = SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const { idpId, idpNonce, idpState, idpLabel, interactionId } =
      await newSessionOidc.get();

    await this.tracking.track(this.tracking.TrackedEventsMap.IDP_CALLEDBACK, {
      req,
    });

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const { accessToken, idToken, acr, amr } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    await this.tracking.track(
      this.tracking.TrackedEventsMap.FC_REQUESTED_IDP_TOKEN,
      {
        req,
      },
    );

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    await this.tracking.track(
      this.tracking.TrackedEventsMap.FC_REQUESTED_IDP_USERINFO,
      {
        req,
      },
    );

    await this.validateIdentity(idpId, identity);

    const identityExchange: OidcSession = {
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
      idpAcr: acr,
      idpLabel,
      idpIdentity: identity,
    };
    await newSessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK',
      redirect: url,
      route: OidcClientRoutes.OIDC_CALLBACK,
    });

    res.redirect(url);
  }

  @Post(OidcClientRoutes.DISCONNECT_FROM_IDP)
  @Header('cache-control', 'no-store')
  async logoutFromIdp(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    this.logger.trace({
      route: OidcClientRoutes.DISCONNECT_FROM_IDP,
      method: 'POST',
      name: 'OidcClientRoutes.DISCONNECT_FROM_IDP',
    });
    const { idpIdToken, idpId } = await sessionOidc.get();

    const { stateLength } = await this.oidcClientConfig.get();
    const idpState: string = this.crypto.genRandomString(stateLength);

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
      );

    return res.redirect(endSessionUrl);
  }

  @Get(OidcClientRoutes.CLIENT_LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  @Render('oidc-provider-logout-form')
  async redirectAfterIdpLogout(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { oidcProviderLogoutForm } = await sessionOidc.get();

    const trackingContext: TrackedEventContextInterface = { req };
    const { FC_SESSION_TERMINATED } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_SESSION_TERMINATED, trackingContext);

    await this.sessionService.destroy(req, res);

    return { oidcProviderLogoutForm };
  }

  private async validateIdentity(idpId: string, identity: OidcIdentityDto) {
    const identityCheckHandler =
      await this.coreVerify.getFeature<IIdentityCheckFeatureHandler>(
        idpId,
        ProcessCore.ID_CHECK,
      );

    const errors = await identityCheckHandler.handle(identity);
    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new CoreFcpInvalidIdentityException();
    }
  }
}
