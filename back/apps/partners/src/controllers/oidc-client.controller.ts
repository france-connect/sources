import { cloneDeep } from 'lodash';

import {
  Controller,
  Get,
  Header,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { OidcSession } from '@fc/oidc';
import { OidcAcrConfig } from '@fc/oidc-acr';
import {
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderPrompt } from '@fc/oidc-provider';
import {
  ISessionService,
  Session,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';

import { AppConfig } from '../dto';
import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';

@Controller()
export class OidcClientController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Get(OidcClientRoutes.REDIRECT_TO_IDP)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToIdp(
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { defaultAcrValue: acr_values } =
      this.config.get<OidcAcrConfig>('OidcAcr');

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    const { agentConnectIdpHint } = this.config.get<AppConfig>('App');

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const prompt = [OidcProviderPrompt.LOGIN].join(' ');

    const authorizeParams = {
      acr_values,
      nonce,
      scope,
      state,
      prompt,
    };

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl(
      agentConnectIdpHint,
      authorizeParams,
    );

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(agentConnectIdpHint);
    const session: OidcClientSession = {
      idpId: agentConnectIdpHint,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
    };

    sessionOidc.set(session);

    res.redirect(authorizationUrl);
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce: nonce, idpState: state } = session;

    const tokenParams = {
      nonce,
      state,
    };
    const { accessToken, acr, idToken } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    const identityExchange: OidcSession = cloneDeep({
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
      idpIdToken: idToken,
    });

    sessionOidc.set(identityExchange);

    // Temporary redirect
    res.redirect(PartnersFrontRoutes.INDEX);
  }

  @Get(PartnersBackRoutes.LOGOUT)
  @Header('cache-control', 'no-store')
  async logout(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    if (!session?.idpIdToken) {
      return res.redirect(PartnersFrontRoutes.INDEX);
    }

    const { idpIdToken, idpState, idpId } = session;

    const { postLogoutRedirectUri } =
      this.config.get<OidcClientConfig>('OidcClient');

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
        postLogoutRedirectUri,
      );

    res.redirect(endSessionUrl);
  }

  @Get(PartnersBackRoutes.LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  async logoutCallback(@Res() res) {
    // delete oidc session
    await this.sessionService.reset(res);

    return res.redirect(PartnersFrontRoutes.INDEX);
  }
}
