import * as deepFreeze from 'deep-freeze';
import { cloneDeep } from 'lodash';

import { Injectable } from '@nestjs/common';

import { asyncFilter, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger-legacy';
import {
  ClientMetadata,
  IdentityProviderMetadata,
  IssuerMetadata,
} from '@fc/oidc';
import { IIdentityProviderAdapter } from '@fc/oidc-client';

import {
  IdentityProviderAdapterEnvConfig,
  IdentityProviderAdapterEnvDTO,
} from './dto';
import { IdentityProvider } from './enums';
import { IIdentityProviderAdapterEnv } from './interfaces';

const CLIENT_METADATA = [
  'client_id',
  'client_secret',
  'post_logout_redirect_uris',
  'redirect_uris',
  'response_types',
  'id_token_signed_response_alg',
  'token_endpoint_auth_method',
  'revocation_endpoint_auth_method',
  'id_token_encrypted_response_alg',
  'id_token_encrypted_response_enc',
  'userinfo_encrypted_response_alg',
  'userinfo_encrypted_response_enc',
  'userinfo_signed_response_alg',
];

const ISSUER_METADATA = [
  'issuer',
  'token_endpoint',
  'authorization_endpoint',
  'jwks_uri',
  'userinfo_endpoint',
  'end_session_endpoint',
];
@Injectable()
export class IdentityProviderAdapterEnvService
  implements IIdentityProviderAdapter
{
  private identityProviderCache: IdentityProviderMetadata[];

  constructor(
    private readonly cryptography: CryptographyService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async findAllIdentityProvider(): Promise<
    IdentityProviderAdapterEnvDTO[]
  > {
    const { discoveryUrl, discovery, provider } =
      this.config.get<IdentityProviderAdapterEnvConfig>(
        'IdentityProviderAdapterEnv',
      );

    const configuration = [
      {
        uid: IdentityProvider.IDP_ID,
        name: 'envIssuer',
        title: 'envIssuer Title',
        active: true,
        display: true,
        discoveryUrl,
        discovery,
        ...provider,
      },
    ];

    const result: any = await asyncFilter(
      configuration,
      async (configuration) => {
        const errors = await validateDto(
          configuration,
          IdentityProviderAdapterEnvDTO,
          validationOptions,
        );

        if (errors.length > 0) {
          this.logger.warn(
            `"${configuration.uid}" was excluded from the result at DTO validation`,
            JSON.stringify(errors),
          );
        }

        return errors.length === 0;
      },
    );
    return result.map((configuration) => configuration);
  }

  /**
   * @param refreshCache  Should we refreshCache the cache made by the service?
   */
  async getList(refreshCache?: boolean): Promise<IdentityProviderMetadata[]> {
    if (refreshCache || !this.identityProviderCache) {
      const list: IIdentityProviderAdapterEnv[] =
        await this.findAllIdentityProvider();
      /**
       * "As" is necessary to prevent error of assigning "readonly" to "modifiable" property
       * It is a workaround, best would be to modify all types.
       */
      this.identityProviderCache = deepFreeze(
        list.map(this.legacyToOpenIdPropertyName.bind(this)),
      ) as IdentityProviderMetadata[];
    }

    return this.identityProviderCache;
  }

  /**
   * Method triggered when you want to filter identity providers
   * from service providers's whitelist/blacklist
   * @param idpList  list of identity providers's clientID
   * @param isBlackListed  boolean false = blacklist true = whitelist
   */
  async getFilteredList(
    idpList: string[],
    blacklist: boolean,
  ): Promise<IdentityProviderMetadata[]> {
    const providers = cloneDeep(await this.getList());
    const mappedProviders = providers.map((provider) => {
      const idpFound = idpList.includes(provider.uid);
      const isIdpAuthorized = blacklist ? !idpFound : idpFound;

      if (!isIdpAuthorized) {
        provider.active = false;
      }

      return provider;
    });
    return mappedProviders;
  }

  async getById(
    id: string,
    refreshCache = false,
  ): Promise<IdentityProviderMetadata> {
    const providers = cloneDeep(await this.getList(refreshCache));
    return providers.find(({ uid }) => uid === id);
  }

  private legacyToOpenIdPropertyName(
    source: IIdentityProviderAdapterEnv,
  ): IdentityProviderMetadata {
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const client_secret = this.decryptClientSecret(source.client_secret);

    const result = {
      ...source,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret,
    };

    /**
     * @TODO #326 Fix type issues between legacy model and `oidc-client` library
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/326
     * We have non blocking incompatilities.
     */
    return this.toPanvaFormat(result);
  }

  private toPanvaFormat(result: unknown): IdentityProviderMetadata {
    const panvaFormatted = {
      client: {} as ClientMetadata,
      issuer: {} as IssuerMetadata,
    };

    Object.entries(result).forEach(([key, value]) => {
      if (CLIENT_METADATA.includes(key)) {
        panvaFormatted.client[key] = value;
      } else if (ISSUER_METADATA.includes(key)) {
        panvaFormatted.issuer[key] = value;
      } else {
        panvaFormatted[key] = value;
      }
    });

    return panvaFormatted as IdentityProviderMetadata;
  }

  /**
   * Decrypt client secrect with specific key provided by configuration
   *
   * @param clientSecret
   */
  private decryptClientSecret(clientSecret: string): string {
    const { clientSecretEncryptKey } =
      this.config.get<IdentityProviderAdapterEnvConfig>(
        'IdentityProviderAdapterEnv',
      );
    return this.cryptography.decrypt(
      clientSecretEncryptKey,
      Buffer.from(clientSecret, 'base64'),
    );
  }
}
