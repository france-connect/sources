/**
 * @TODO #1024 MAJ Jose version 3.X
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1024
 * @ticket #FC-1024
 */
import { isURL } from 'class-validator';
import { JWK } from 'jose-openid-client';
import {
  AuthorizationParameters,
  CallbackExtras,
  CallbackParamsType,
  Client,
  TokenSet,
} from 'openid-client';

import { Inject, Injectable } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import {
  IOidcIdentity,
  IServiceProviderAdapter,
  SERVICE_PROVIDER_SERVICE_TOKEN,
} from '@fc/oidc';

import {
  OidcClientFailedToFetchBlacklist,
  OidcClientGetEndSessionUrlException,
  OidcClientIdpBlacklistedException,
  OidcClientIdpDisabledException,
  OidcClientIdpNotFoundException,
  OidcClientInvalidStateException,
  OidcClientMissingCodeException,
  OidcClientMissingStateException,
  OidcClientTokenFailedException,
} from '../exceptions';
import {
  ExtraTokenParams,
  IIdentityProviderAdapter,
  TokenParams,
} from '../interfaces';
import { IDENTITY_PROVIDER_SERVICE } from '../tokens';
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
    @Inject(IDENTITY_PROVIDER_SERVICE)
    private readonly identityProvider: IIdentityProviderAdapter,
  ) {}

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

    return params;
  }

  async getAuthorizeUrl(
    idpId: string,
    authorizationParams: AuthorizationParameters,
  ): Promise<string> {
    const client: Client = await this.issuer.getClient(idpId);

    return client.authorizationUrl(authorizationParams);
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

  checkState(callbackParams, stateFromSession: string): void {
    if (!callbackParams.state) {
      throw new OidcClientMissingStateException();
    }

    if (callbackParams.state !== stateFromSession) {
      throw new OidcClientInvalidStateException();
    }
  }

  private checkCode(callbackParams): void {
    if (!callbackParams.code) {
      throw new OidcClientMissingCodeException();
    }
  }

  private extractParams(
    callbackParams: CallbackParamsType,
    stateFromSession: string,
  ): any {
    this.checkCode(callbackParams);
    this.checkState(callbackParams, stateFromSession);

    return callbackParams;
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
    const client = await this.issuer.getClient(ipdId);
    const { state } = params;

    const callbackParams = client.callbackParams(req);
    const receivedParams = this.extractParams(callbackParams, state);

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
      this.logger.debug(JSON.stringify(error));
      throw new OidcClientTokenFailedException();
    }

    return tokenSet;
  }

  async revokeToken(accessToken: string, idpId: string): Promise<void> {
    const client = await this.issuer.getClient(idpId);

    await client.revoke(accessToken);
  }

  async getUserInfo(
    accessToken: string,
    idpId: string,
  ): Promise<IOidcIdentity> {
    const client = await this.issuer.getClient(idpId);

    const userInfo = (await client.userinfo(accessToken)) as IOidcIdentity;

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
      throw new OidcClientGetEndSessionUrlException();
    }

    /**
     * Temporary remove client_id from endSessionUrl since parameter was not provided in previous version of openid-client
     * This might break the logout with our Idps
     * @todo #1449 Enable client_id in endSessionUrl
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1449
     *
     */

    const temporaryWorkAroundUrl = endSessionUrl.replace(
      /(&|\?)client_id=[^&]+/,
      '',
    );

    return temporaryWorkAroundUrl;
  }

  async hasEndSessionUrl(idpId: string): Promise<boolean> {
    const client = await this.issuer.getClient(idpId);

    let endSessionUrl;

    try {
      endSessionUrl = client.endSessionUrl();
      return isURL(endSessionUrl, { protocols: ['http', 'https'] });
    } catch (error) {
      this.logger.err({ error });
      return false;
    }
  }

  /**
   * Method to check if
   * an identity provider is blacklisted or whitelisted.
   *
   * @param {string} spId service provider ID
   * @param {string} idpId identity provider ID
   * @returns {Promise<void>}
   * @throws OidcClientFailedToFetchBlacklist if the idp restrictions of the sp couldn't be fetched
   * @throws OidcClientIdpBlacklistedException if the idp is blacklisted or not whitelisted
   */
  async checkIdpBlacklisted(spId: string, idpId: string): Promise<void> {
    let isIdpExcluded = false;
    try {
      isIdpExcluded = await this.serviceProvider.shouldExcludeIdp(spId, idpId);
    } catch (error) {
      throw new OidcClientFailedToFetchBlacklist();
    }

    if (isIdpExcluded) {
      throw new OidcClientIdpBlacklistedException();
    }
  }

  async checkIdpDisabled(idpId: string): Promise<void> {
    const idp = await this.identityProvider.getById(idpId);

    if (!idp) {
      throw new OidcClientIdpNotFoundException();
    }

    if (!idp.active) {
      throw new OidcClientIdpDisabledException();
    }
  }
}
