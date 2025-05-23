import { Request, Response } from 'express';
import { cloneDeep } from 'lodash';

import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreVerifyService } from '@fc/core';
import { CryptographyService } from '@fc/cryptography';
import { CsrfTokenGuard } from '@fc/csrf';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcCallbackInterface, OidcSession } from '@fc/oidc';
import {
  OidcClientConfigService,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  AppConfig,
  GetOidcCallbackOidcClientSessionDto,
  GetOidcCallbackSessionDto,
  GetRedirectToIdpOidcClientSessionDto,
} from '../dto';
import { CoreFcpService, CoreFcpVerifyService } from '../services';

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
    private readonly config: ConfigService,
    private readonly coreVerify: CoreVerifyService,
    private readonly coreFcpVerify: CoreFcpVerifyService,
    private readonly tracking: TrackingService,
    private readonly sessionService: SessionService,
    private readonly crypto: CryptographyService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
  ) {}

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  @UseGuards(CsrfTokenGuard)
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
    _sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { providerUid: idpId } = body;

    const {
      params: { acr_values },
    } = await this.oidcProvider.getInteraction(req, res);

    await this.coreFcp.redirectToIdp(res, idpId, { acr_values });
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
    return await this.oidcClient.utils.wellKnownKeys();
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
    sessionOidc: ISessionService<OidcClientSession>,
    @Query()
    { error, error_description, state }: OidcCallbackInterface,
  ) {
    if (error) {
      const { idpState } = sessionOidc.get();
      this.oidcClient.utils.checkState({ state }, idpState);

      await this.coreFcpVerify.handleIdpError(req, res, {
        error,
        error_description,
      });
      return;
    }

    const trackingContext: TrackedEventContextInterface = { req };
    const {
      IDP_CALLEDBACK,
      FC_REQUESTED_IDP_TOKEN,
      FC_REQUESTED_IDP_USERINFO,
    } = this.tracking.TrackedEventsMap;

    await this.sessionService.duplicate(res, GetOidcCallbackSessionDto);
    this.logger.debug('Session has been detached and duplicated');

    const { idpId, idpNonce, idpState, idpLabel, interactionId } =
      sessionOidc.get();

    await this.tracking.track(IDP_CALLEDBACK, trackingContext);

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const {
      accessToken,
      idToken,
      acr,
      idpRepresentativeScope = [],
    } = await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    await this.tracking.track(FC_REQUESTED_IDP_TOKEN, trackingContext);

    const { amr } = await this.identityProvider.getById(idpId);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    await this.tracking.track(FC_REQUESTED_IDP_USERINFO, trackingContext);

    await this.coreFcpVerify.validateIdentity(idpId, identity);

    const identityExchange: OidcSession = cloneDeep({
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
      idpAcr: acr,
      idpLabel,
      idpIdentity: identity,
      idpRepresentativeScope,
    });
    sessionOidc.set(identityExchange);

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    res.redirect(url);
  }

  @Post(OidcClientRoutes.DISCONNECT_FROM_IDP)
  @Header('cache-control', 'no-store')
  async logoutFromIdp(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { idpIdToken, idpId } = sessionOidc.get();

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
    const { oidcProviderLogoutForm } = sessionOidc.get();

    const trackingContext: TrackedEventContextInterface = { req };
    const { FC_SESSION_TERMINATED } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_SESSION_TERMINATED, trackingContext);

    await this.sessionService.destroy(res);

    return { oidcProviderLogoutForm };
  }
}
