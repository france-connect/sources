/**
 * @TODO update Jose version to 3.X
 * For now openid-client panva's library does not support jose 3.X but
 * it will be available in a neer future. So once it's done we just
 * need to remove this hack in the package.json
 */
import { JWK } from 'jose-openid-client';
import { CallbackExtras, Client, TokenSet } from 'openid-client';

import { Inject, Injectable } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import {
  IOidcIdentity,
  IServiceProviderAdapter,
  SERVICE_PROVIDER_SERVICE_TOKEN,
} from '@fc/oidc';

import {
  OidcClientFailedToFetchBlacklist,
  OidcClientGetEndSessionUrlException,
  OidcClientIdpBlacklistedException,
  OidcClientInvalidStateException,
  OidcClientMissingCodeException,
  OidcClientMissingStateException,
  OidcClientTokenFailedException,
} from '../exceptions';
import {
  ExtraTokenParams,
  IGetAuthorizeUrlParams,
  TokenParams,
} from '../interfaces';
import { OidcClientConfigService } from './oidc-client-config.service';
import { OidcClientIssuerService } from './oidc-client-issuer.service';

@Injectable()
export class OidcClientUtilsService {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly issuer: OidcClientIssuerService,
    private readonly oidcClientConfig: OidcClientConfigService,
    private readonly crypto: CryptographyService,
    @Inject(SERVICE_PROVIDER_SERVICE_TOKEN)
    private readonly serviceProvider: IServiceProviderAdapter,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async buildAuthorizeParameters() {
    const { stateLength } = await this.oidcClientConfig.get();
    const state = this.crypto.genRandomString(stateLength);
    /**
     * @TODO #430 specific parameter for nonce length (or rename mutual parameter)
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/430
     * choisir entre uid et getreandomstring
     */
    const nonce = this.crypto.genRandomString(stateLength);
    const params = {
      state,
      nonce,
    };

    this.logger.trace({ params });

    return params;
  }

  async getAuthorizeUrl({
    state,
    scope,
    idpId,
    // acr_values is an oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values,
    nonce,
    claims,
  }: IGetAuthorizeUrlParams): Promise<string> {
    const client: Client = await this.issuer.getClient(idpId);

    const params = {
      scope,
      state,
      nonce,
      claims,
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      prompt: 'login',
    };

    this.logger.trace({ params });

    return client.authorizationUrl(params);
  }

  async wellKnownKeys() {
    const {
      jwks: { keys },
    } = await this.oidcClientConfig.get();

    /**
     * @TODO #427 Check why `JSONWebKeySet` entries are not compatible with `asKey` method
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/427
     * Maybe we don't need this convertion?
     */

    const publicKeys = keys.map((key) => JWK.asKey(key as any).toJWK());

    return { keys: publicKeys };
  }

  private async extractParams(req, client, stateFromSession: string) {
    /**
     * Although it is not noted as async
     * openidClient.callbackParams is and should be awaited
     */
    const receivedParams = await client.callbackParams(req);

    if (!receivedParams.code) {
      throw new OidcClientMissingCodeException();
    }

    if (!receivedParams.state) {
      throw new OidcClientMissingStateException();
    }

    if (receivedParams.state !== stateFromSession) {
      throw new OidcClientInvalidStateException();
    }

    return receivedParams;
  }

  private buildExtraParameters(extraParams: ExtraTokenParams): CallbackExtras {
    if (extraParams) {
      return { exchangeBody: extraParams };
    }

    return {};
  }

  async getTokenSet(
    req,
    ipdId: string,
    params: TokenParams,
    extraParams?: ExtraTokenParams,
  ): Promise<TokenSet> {
    this.logger.debug('getTokenSet');
    const client = await this.issuer.getClient(ipdId);
    const { state } = params;
    const receivedParams = await this.extractParams(req, client, state);

    let tokenSet: TokenSet;

    try {
      // Invoke `openid-client` handler
      tokenSet = await client.callback(
        client.metadata.redirect_uris.join(','),
        receivedParams,
        {
          ...params,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          response_type: client.metadata.response_types.join(','),
        },
        this.buildExtraParameters(extraParams),
      );
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new OidcClientTokenFailedException();
    }

    this.logger.trace({ tokenSet });

    return tokenSet;
  }

  async revokeToken(accessToken: string, idpId: string): Promise<void> {
    this.logger.debug('revokeToken');
    const client = await this.issuer.getClient(idpId);

    this.logger.trace({ accessToken, idpId });

    await client.revoke(accessToken);
  }

  async getUserInfo(
    accessToken: string,
    idpId: string,
  ): Promise<IOidcIdentity> {
    this.logger.debug('getUserInfo');
    const client = await this.issuer.getClient(idpId);

    const userInfo = (await client.userinfo(accessToken)) as IOidcIdentity;

    this.logger.trace({ accessToken, idpId, userInfo });

    return userInfo;
  }

  /**
   * Build the endSessionUrl with given parameters.
   *
   * @param {string} idpId The current idp id
   * @param {string} stateFromSession The current state
   * @param {TokenSet | string} idTokenHint The last idToken retrieved
   * @param {string} postLogoutRedirectUri The url to redirect after logout
   * @returns {Promise<string>} The endSessionUrl with all parameters (state, postLogoutRedirectUri, ...)
   */
  async getEndSessionUrl(
    idpId: string,
    stateFromSession: string,
    idTokenHint?: TokenSet | string,
    postLogoutRedirectUri?: string,
  ): Promise<string> {
    this.logger.debug('getEndSessionUrl');
    const client = await this.issuer.getClient(idpId);

    let endSessionUrl;

    try {
      endSessionUrl = client.endSessionUrl({
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_hint: idTokenHint,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        post_logout_redirect_uri: postLogoutRedirectUri,
        state: stateFromSession,
      });
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new OidcClientGetEndSessionUrlException();
    }

    this.logger.trace({ idpId, endSessionUrl });

    return endSessionUrl;
  }

  /**
   * Method to check if
   * an identity provider is blacklisted or whitelisted.
   *
   * @param {string} spId service provider ID
   * @param {string} idpId identity provider ID
   * @returns {Promise<boolean>}
   */
  async checkIdpBlacklisted(spId: string, idpId: string): Promise<boolean> {
    let isIdpExcluded = false;
    try {
      isIdpExcluded = await this.serviceProvider.shouldExcludeIdp(spId, idpId);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new OidcClientFailedToFetchBlacklist();
    }

    if (isIdpExcluded) {
      this.logger.trace({ isIdpExcluded }, LoggerLevelNames.WARN);
      throw new OidcClientIdpBlacklistedException();
    }

    this.logger.trace({ check: { spId, idpId, isIdpExcluded } });

    return false;
  }
}
