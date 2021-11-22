import { encode } from 'querystring';

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import {
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionNotFoundException,
} from '@fc/session';

import { AccessTokenParamsDTO } from '../dto';
import { MockServiceProviderRoutes } from '../enums';
import {
  MockServiceProviderTokenRevocationException,
  MockServiceProviderUserinfoException,
} from '../exceptions';

@Controller()
export class MockServiceProviderController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly logger: LoggerService,
    private readonly crypto: CryptographyService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get()
  @Render('index')
  async index(
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { defaultAcrValue } = this.config.get('App');

    // Only one provider is available with `@fc/identity-provider-env`
    const [provider] = await this.identityProvider.getList();

    const { authorizationUrl, params } = await this.getInteractionParameters(
      provider,
    );

    const sessionIdLength = 32;
    const sessionId: string = this.crypto.genRandomString(sessionIdLength);

    await sessionOidc.set({
      sessionId,
      idpId: provider.uid,
      idpState: params.state,
      idpNonce: params.nonce,
    });

    const response = {
      titleFront: 'Mock Service Provider',
      params,
      authorizationUrl: authorizationUrl,
      defaultAcrValue,
    };

    this.logger.trace({
      route: '/',
      method: 'GET',
      response,
    });

    return response;
  }

  @Get(MockServiceProviderRoutes.VERIFY)
  @Render('login-callback')
  async getVerify(
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session = await sessionOidc.get();

    const response = {
      ...session,
      accessToken: session.idpAccessToken,
      titleFront: 'Mock Service Provider - Login Callback',
    };

    this.logger.trace({
      route: MockServiceProviderRoutes.VERIFY,
      method: 'GET',
      name: 'MockServiceProviderRoutes.VERIFY',
      response,
    });

    return response;
  }

  @Get(MockServiceProviderRoutes.LOGOUT)
  async logout(
    @Res() res,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Query('post_logout_redirect_uri')
    postLogoutRedirectUri?: string,
  ) {
    const { idpIdToken, idpState, idpId } = await sessionOidc.get();

    const endSessionUrl = await this.oidcClient.getEndSessionUrlFromProvider(
      idpId,
      idpState,
      idpIdToken,
      postLogoutRedirectUri,
    );

    this.logger.trace({
      route: MockServiceProviderRoutes.LOGOUT,
      method: 'GET',
      name: 'MockServiceProviderRoutes.LOGOUT',
      redirect: endSessionUrl,
    });

    res.redirect(endSessionUrl);
  }

  @Get(MockServiceProviderRoutes.LOGOUT_CALLBACK)
  async logoutCallback(@Res() res) {
    /**
     * @TODO #192 ETQ Dev, je complète la session pendant la cinématique des mocks
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/192
     */

    this.logger.trace({
      route: MockServiceProviderRoutes.LOGOUT_CALLBACK,
      method: 'GET',
      name: 'MockServiceProviderRoutes.LOGOUT_CALLBACK',
      redirect: '/',
    });

    return res.redirect('/');
  }

  @Post(MockServiceProviderRoutes.REVOCATION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('success-revoke-token')
  async revocationToken(
    @Res()
    res,
    @Body()
    body: AccessTokenParamsDTO,
  ) {
    let response;
    try {
      /**
       * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
       */
      const providerUid = 'envIssuer';
      const { accessToken } = body;
      await this.oidcClient.utils.revokeToken(accessToken, providerUid);

      response = {
        titleFront: 'Mock Service Provider - Token révoqué',
        accessToken,
      };
    } catch (e) {
      this.logger.trace({ e }, LoggerLevelNames.WARN);
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to revoke the token : 'MockServiceProviderTokenRevocationException'
       */
      if (e.error && e.error_description) {
        const redirect = `/error?error=${e.error}&error_description=${e.error_description}`;

        this.logger.trace({ redirect }, LoggerLevelNames.WARN);

        return res.redirect(redirect);
      }
      throw new MockServiceProviderTokenRevocationException();
    }

    this.logger.trace({
      route: MockServiceProviderRoutes.REVOCATION,
      method: 'POST',
      name: 'MockServiceProviderRoutes.REVOCATION',
      response,
    });

    return response;
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  // needed for controller
  // eslint-disable-next-line max-params
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  async getOidcCallback(
    @Req() req,
    @Res() res,
    @Query() query,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    /**
     * @todo Adaptation for now, we should probably find a better way to handle
     * errors on the oidc callback on the mock.
     * @Todo Since nodev16 should use the <URLSearchParams> API instead of querystring.encode
     *
     * @author Stéphane/Matthieu
     * @date 2021-05-12
     * @ticket FC-xxx
     */
    if (query.error) {
      const errorUri = `/error?${encode(query)}`;

      this.logger.trace({ query, errorUri }, LoggerLevelNames.WARN);

      return res.redirect(errorUri);
    }

    const session: OidcSession = await sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce, idpState, interactionId } = session;

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };
    const { accessToken, idToken, acr, amr } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity: IOidcIdentity =
      await this.oidcClient.getUserInfosFromProvider(userInfoParams, req);

    /**
     * @todo
     *    action: Check the data returns from FC.
     *
     * @author Arnaud
     * @date 19/03/2020
     * @ticket FC-244 (identity, DTO, Mock, FS)
     */
    const identityExchange: OidcSession = {
      idpIdentity: identity,
      idpAcr: acr,
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
    };

    await sessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    this.logger.trace({
      route: OidcClientRoutes.OIDC_CALLBACK,
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK',
      identityExchange,
      redirect: url,
    });

    res.redirect(url);
  }

  @Post(MockServiceProviderRoutes.USERINFO)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('login-callback')
  async retrieveUserinfo(@Res() res, @Body() body: AccessTokenParamsDTO) {
    let response;
    try {
      /**
       * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
       */
      const providerUid = 'envIssuer';
      const { accessToken } = body;
      // OIDC: call idp's /userinfo endpoint
      const idpIdentity = await this.oidcClient.utils.getUserInfo(
        accessToken,
        providerUid,
      );

      response = {
        titleFront: 'Mock Service Provider - Userinfo',
        accessToken,
        idpIdentity,
      };
    } catch (e) {
      this.logger.trace({ e }, LoggerLevelNames.WARN);
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to receive userinfo : 'MockServiceProviderUserinfoException'
       */
      if (e.error && e.error_description) {
        const redirect = `/error?error=${e.error}&error_description=${e.error_description}`;

        this.logger.trace({ redirect }, LoggerLevelNames.WARN);

        return res.redirect(redirect);
      }
      throw new MockServiceProviderUserinfoException();
    }

    this.logger.trace({
      route: MockServiceProviderRoutes.USERINFO,
      method: 'POST',
      name: 'MockServiceProviderRoutes.USERINFO',
      response,
    });

    return response;
  }

  @Get(MockServiceProviderRoutes.ERROR)
  @Render('error')
  async error(@Query() query) {
    const response = {
      titleFront: "Mock service provider - Erreur lors de l'authentification",
      ...query,
    };

    this.logger.trace({
      route: MockServiceProviderRoutes.ERROR,
      method: 'GET',
      name: 'MockServiceProviderRoutes.ERROR',
      response,
    });

    return response;
  }

  private async getInteractionParameters(provider: IdentityProviderMetadata) {
    const oidcClientConfig = this.config.get<OidcClientConfig>('OidcClient');
    const { scope, acr, claims } = oidcClientConfig;
    const { state, nonce } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizationUrl: string =
      await this.oidcClient.utils.getAuthorizeUrl({
        state,
        scope,
        idpId: provider.uid,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: acr,
        nonce,
        claims,
      });

    const url = new URL(authorizationUrl);

    return {
      params: {
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: provider.client.redirect_uris[0],
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: provider.client.client_id,
        uid: provider.uid,
        state,
        scope,
        acr,
        claims,
        nonce,
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        authorization_endpoint: `${url.origin}${url.pathname}`,
      },
      authorizationUrl,
    };
  }
}
