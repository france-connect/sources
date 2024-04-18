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

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
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
} from '@fc/session';

import { AccessTokenParamsDTO, AppConfig, DataApi } from '../dto';
import { MockServiceProviderRoutes } from '../enums';
import {
  MockServiceProviderTokenRevocationException,
  MockServiceProviderUserinfoException,
} from '../exceptions';
import { MockServiceProviderService } from '../services';

@Controller()
export class MockServiceProviderController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly logger: LoggerService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
    private readonly mockServiceProvider: MockServiceProviderService,
  ) {}

  @Get(MockServiceProviderRoutes.INDEX)
  @Render('index')
  async index(
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { defaultAcrValue } = this.config.get<OidcAcrConfig>('OidcAcr');

    // Only one provider is available with `@fc/identity-provider-env`
    const [provider] = await this.identityProvider.getList();

    const { authorizationUrl, params } =
      await this.getInteractionParameters(provider);

    sessionOidc.set({
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

    return response;
  }

  @Get(MockServiceProviderRoutes.VERIFY)
  @Render('login-callback')
  getVerify(
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session = sessionOidc.get();

    // Redirect to the home page if no idpIdentity present in the session
    if (!session?.idpIdentity) {
      res.redirect('/');
    }

    const { dataApis } = this.config.get<AppConfig>('App');

    const response = {
      ...session,
      accessToken: session.idpAccessToken,
      titleFront: 'Mock Service Provider - Login Callback',
      dataApiActive: dataApis?.length > 0,
    };

    return response;
  }

  @Get(MockServiceProviderRoutes.LOGOUT)
  async logout(
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Query('post_logout_redirect_uri')
    postLogoutRedirectUri?: string,
  ) {
    const { idpIdToken, idpState, idpId } = sessionOidc.get();

    const endSessionUrl = await this.oidcClient.getEndSessionUrlFromProvider(
      idpId,
      idpState,
      idpIdToken,
      postLogoutRedirectUri,
    );

    res.redirect(endSessionUrl);
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
      const providerUid = this.getIdpId();
      const { accessToken } = body;
      await this.oidcClient.utils.revokeToken(accessToken, providerUid);

      const { dataApis } = this.config.get<AppConfig>('App');

      response = {
        titleFront: 'Mock Service Provider - Token révoqué',
        accessToken,
        dataApiActive: dataApis?.length > 0,
      };
    } catch (e) {
      this.logger.err(e);
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to revoke the token : 'MockServiceProviderTokenRevocationException'
       */
      if (e.error && e.error_description) {
        const redirect = `/error?error=${e.error}&error_description=${e.error_description}`;

        return res.redirect(redirect);
      }
      throw new MockServiceProviderTokenRevocationException();
    }

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
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
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

      return res.redirect(errorUri);
    }

    const session: OidcSession = sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce, idpState } = session;

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

    sessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/verify`;

    res.redirect(url);
  }

  @Post(MockServiceProviderRoutes.USERINFO)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('login-callback')
  async retrieveUserinfo(
    @Res() res,
    @Body() body: AccessTokenParamsDTO,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    let response;
    try {
      /**
       * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
       */
      const providerUid = this.getIdpId();
      const { accessToken } = body;
      // OIDC: call idp's /userinfo endpoint
      const idpIdentity = await this.oidcClient.utils.getUserInfo(
        accessToken,
        providerUid,
      );

      const idpIdToken = sessionOidc.get('idpIdToken');

      const { dataApis } = this.config.get<AppConfig>('App');

      response = {
        titleFront: 'Mock Service Provider - Userinfo',
        accessToken,
        idpIdentity,
        idpIdToken,
        dataApiActive: dataApis?.length > 0,
      };
    } catch (e) {
      this.logger.err(e);
      /**
       * @params e.error : error return by panva lib
       * @params e.error_description : error description return by panva lib
       *
       * If exception is not return by panva, we throw our custom class exception
       * when we try to receive userinfo : 'MockServiceProviderUserinfoException'
       */
      if (e.error && e.error_description) {
        const redirect = `/error?error=${e.error}&error_description=${e.error_description}`;

        return res.redirect(redirect);
      }
      throw new MockServiceProviderUserinfoException();
    }

    return response;
  }

  @Get(MockServiceProviderRoutes.DATA)
  async getAllData(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { dataApis } = this.config.get<AppConfig>('App');

    if (!dataApis?.length) {
      const redirect = `/error?error=no_data_provider&error_description=${encodeURIComponent(
        'No data provider configured.',
      )}`;
      return res.redirect(redirect);
    }

    const { idpAccessToken } = sessionOidc.get();

    const data = await Promise.all(
      dataApis.map(async (dataApi) => {
        const response = await this.getData(dataApi, idpAccessToken);
        return {
          name: dataApi.name,
          response,
        };
      }),
    );

    const response = {
      titleFront: 'Mock Service Provider - UserData',
      accessToken: idpAccessToken,
      data,
      dataApiActive: true,
    };

    return res.render('data', response);
  }

  @Get(MockServiceProviderRoutes.ERROR)
  @Render('error')
  error(@Query() query) {
    const response = {
      titleFront: "Mock service provider - Erreur lors de l'authentification",
      ...query,
    };

    return response;
  }

  private async getInteractionParameters(provider: IdentityProviderMetadata) {
    const { defaultAcrValue } = this.config.get<OidcAcrConfig>('OidcAcr');
    const { scope, claims, redirectUri } =
      this.config.get<OidcClientConfig>('OidcClient');

    const { state, nonce } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const prompt = [OidcProviderPrompt.LOGIN, OidcProviderPrompt.CONSENT];

    const authorizeParams = {
      state,
      scope,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: defaultAcrValue,
      nonce,
      claims,
      prompt: prompt.join(' '),
    };

    const authorizationUrl: string =
      await this.oidcClient.utils.getAuthorizeUrl(
        provider.uid,
        authorizeParams,
      );

    const url = new URL(authorizationUrl);

    return {
      params: {
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: redirectUri,
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: provider.client.client_id,
        uid: provider.uid,
        state,
        scope,
        acr: defaultAcrValue,
        claims,
        nonce,
        // oidc name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        authorization_endpoint: `${url.origin}${url.pathname}`,
        prompt,
      },
      authorizationUrl,
    };
  }

  private getIdpId(): string {
    const { idpId } = this.config.get<AppConfig>('App');

    return idpId;
  }

  private async getData(
    { url, secret }: DataApi,
    idpAccessToken: string,
  ): Promise<unknown> {
    try {
      const data = await this.mockServiceProvider.getData(
        url,
        idpAccessToken,
        secret,
      );

      return data;
    } catch (e) {
      return e;
    }
  }
}
