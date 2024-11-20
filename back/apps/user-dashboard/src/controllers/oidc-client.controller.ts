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

import {
  AccessTokenParamsDTO,
  AppConfig,
  AppSession,
  RedirectToIdpQueryDto,
} from '../dto';
import { UserDashboardBackRoutes, UserDashboardFrontRoutes } from '../enums';
import { UserDashboardTokenRevocationException } from '../exceptions';

@Controller()
export class OidcClientController {
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToIdp(
    @Res() res,
    @Query() query: RedirectToIdpQueryDto,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App') sessionApp: ISessionService<AppSession>,
  ): Promise<void> {
    const { defaultAcrValue: acr_values } =
      this.config.get<OidcAcrConfig>('OidcAcr');

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    const idpId = this.getIdpId();

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
      idpId,
      authorizeParams,
    );

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    const session: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
    };

    sessionOidc.set(session);

    sessionApp.set({
      redirectUrl: query.redirectUrl,
    });

    res.redirect(authorizationUrl);
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

  @Get(UserDashboardBackRoutes.LOGOUT)
  async logout(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    if (!session?.idpIdToken) {
      // BUSINESS: Redirect to business page
      const redirect = '/';

      return res.redirect(redirect);
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

  @Get(UserDashboardBackRoutes.LOGOUT_CALLBACK)
  async logoutCallback(
    @Req() req,
    @Res() res,
    @Session('App') sessionApp: ISessionService<AppSession>,
  ) {
    const redirectUrl =
      sessionApp.get('redirectUrl') || UserDashboardFrontRoutes.INDEX;

    // delete oidc session
    await this.sessionService.reset(res);

    // BUSINESS: Redirect to the redirectUrl specified in redirectToIdp Query
    return res.redirect(redirectUrl);
  }

  @Post(UserDashboardBackRoutes.REVOCATION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('success-revoke-token')
  async revocationToken(@Res() res, @Body() body: AccessTokenParamsDTO) {
    try {
      /**
       * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
       */
      const providerUid = 'core-fcp-high';
      const { accessToken } = body;
      await this.oidcClient.utils.revokeToken(accessToken, providerUid);

      return {
        accessToken,
        titleFront: 'Mock Service Provider - Token révoqué',
      };
    } catch (e) {
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to revoke the token : 'MockServiceProviderTokenRevocationException'
       */
      if (e.error && e.error_description) {
        return res.redirect(
          `/error?error=${e.error}&error_description=${e.error_description}`,
        );
      }
      throw new UserDashboardTokenRevocationException();
    }
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
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
    @Session('App') sessionApp: ISessionService<AppSession>,
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

    /**
     *  @todo
     *    author: Arnaud
     *    date: 19/03/2020
     *    ticket: FC-244 (identity, DTO, Mock, FS)
     *
     *    action: Check the data returns from FC
     */

    const identityExchange: OidcSession = cloneDeep({
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
      idpIdToken: idToken,
    });

    sessionOidc.set(identityExchange);

    const redirectUrl =
      sessionApp.get('redirectUrl') || UserDashboardFrontRoutes.HISTORY;

    // BUSINESS: Redirect to the redirectUrl specified in redirectToIdp Query
    res.redirect(redirectUrl);
  }

  private getIdpId(): string {
    const { idpId } = this.config.get<AppConfig>('App');

    return idpId;
  }
}
