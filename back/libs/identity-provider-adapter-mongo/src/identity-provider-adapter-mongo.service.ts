import * as deepFreeze from 'deep-freeze';
import { cloneDeep } from 'lodash';
import { Model } from 'mongoose';

import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';
import {
  ClientMetadata,
  IdentityProviderMetadata,
  IssuerMetadata,
} from '@fc/oidc';
import { IIdentityProviderAdapter } from '@fc/oidc-client';

import {
  DiscoveryIdpAdapterMongoDTO,
  IdentityProviderAdapterMongoConfig,
  NoDiscoveryIdpAdapterMongoDTO,
} from './dto';
import { FilteringOptions } from './interfaces';
import { IdentityProvider } from './schemas';

const CLIENT_METADATA = [
  'client_id',
  'client_secret',
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
export class IdentityProviderAdapterMongoService
  implements IIdentityProviderAdapter
{
  private listCache: IdentityProviderMetadata[];

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    @InjectModel('IdentityProvider')
    private readonly identityProviderModel: Model<IdentityProvider>,
    private readonly crypto: CryptographyService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {}

  async onModuleInit() {
    this.mongooseWatcher.watchWith<IdentityProvider>(
      this.identityProviderModel,
      this.refreshCache.bind(this),
    );
    this.logger.debug('Initializing identity-provider');

    // Warm up cache and shows up excluded IdPs
    await this.getList();
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  private async findAllIdentityProvider(): Promise<IdentityProviderMetadata[]> {
    const rawResult = await this.identityProviderModel
      .find(
        {},
        {
          _id: false,
          amr: true,
          active: true,
          isBeta: true,
          authzURL: true,
          clientID: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: true,
          discovery: true,
          discoveryUrl: true,
          display: true,
          eidas: true,
          featureHandlers: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_encrypted_response_alg: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_encrypted_response_enc: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: true,
          image: true,
          issuer: true,
          jwksURL: true,
          name: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          response_types: true,
          // openid defined property names
          // eslint-disable-next-line @typescript-eslint/naming-convention
          revocation_endpoint_auth_method: true,
          title: true,
          tokenURL: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          token_endpoint_auth_method: true,
          uid: true,
          url: true,
          userInfoURL: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_encrypted_response_alg: true,
          // oidc defined variable namev
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_encrypted_response_enc: true,
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: true,
          endSessionURL: true,
          modal: true,
        },
      )
      .sort({ order: 'asc', createdAt: 'asc' })
      .lean();

    const { disableIdpValidationOnLegacy } =
      this.config.get<IdentityProviderAdapterMongoConfig>(
        'IdentityProviderAdapterMongo',
      );

    const identityProviders = await asyncFilter<IdentityProviderMetadata[]>(
      rawResult,
      async (doc: IdentityProviderMetadata) => {
        /**
         * @todo #902 see issue
         * A DTO should validate the IdPs even with legacy format
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/902
         */
        if (disableIdpValidationOnLegacy) {
          this.logger.warning(
            `"${doc.uid}": Skipping DTO validation due to legacy IdP mode.`,
          );
          return true;
        }

        const dto = this.getIdentityProviderDTO(doc.discovery);
        const errors = await validateDto(doc, dto, validationOptions);
        const { name, uid } = doc;

        if (errors.length > 0) {
          this.logger.alert(
            `Identity provider "${name}" (${uid}) was excluded at DTO validation`,
          );

          this.logger.debug({ errors });
        }

        return errors.length === 0;
      },
    );

    return identityProviders;
  }

  /**
   * @param refreshCache  Should we refreshCache the cache made by the service?
   */
  async getList(refreshCache?: boolean): Promise<IdentityProviderMetadata[]> {
    if (refreshCache || !this.listCache) {
      this.logger.debug('Refresh cache from DB');
      const list = await this.findAllIdentityProvider();
      this.listCache = deepFreeze(
        list.map(this.legacyToOpenIdPropertyName.bind(this)),
      ) as IdentityProviderMetadata[];
    }

    return this.listCache;
  }

  /**
   * Method triggered when you want to filter identity providers
   * from service providers's whitelist/blacklist
   * @param idpList  list of identity providers's clientID
   * @param blacklist  boolean false = blacklist true = whitelist
   */
  async getFilteredList(
    options: FilteringOptions,
  ): Promise<IdentityProviderMetadata[]> {
    const providers = cloneDeep(await this.getList());
    const { blacklist, idpList } = options;
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

    const provider = providers.find(({ uid }) => uid === id);

    return provider;
  }

  async isActiveById(id: string): Promise<boolean> {
    const idp = await this.getById(id);

    return Boolean(idp?.active);
  }

  private legacyToOpenIdPropertyName(
    source: IdentityProvider,
  ): IdentityProviderMetadata {
    const mapping = {
      // Oidc provider properties
      authzURL: 'authorization_endpoint',
      clientID: 'client_id',
      endSessionURL: 'end_session_endpoint',
      jwksURL: 'jwks_uri',
      tokenURL: 'token_endpoint',
      url: 'issuer',
      userInfoURL: 'userinfo_endpoint',
      // Business properties
      eidas: 'maxAuthorizedAcr',
    };

    const result: Partial<IdentityProvider & IdentityProviderMetadata> = {
      ...source,
    };

    Object.entries(mapping).forEach(([legacyName, oidcName]) => {
      result[oidcName] = source[legacyName];
      Reflect.deleteProperty(result, legacyName);
    });

    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.client_secret = this.decryptClientSecret(source.client_secret);
    result.maxAuthorizedAcr = `eidas${source['eidas']}`;

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
   * Decrypt client secret with specific key provided by configuration
   *
   * @param clientSecret
   */
  private decryptClientSecret(clientSecret: string): string {
    const { clientSecretEncryptKey, decryptClientSecretFeature } =
      this.config.get<IdentityProviderAdapterMongoConfig>(
        'IdentityProviderAdapterMongo',
      );

    if (!decryptClientSecretFeature) {
      return null;
    }

    return this.crypto.decrypt(
      clientSecretEncryptKey,
      Buffer.from(clientSecret, 'base64'),
    );
  }

  private getIdentityProviderDTO(
    discovery: boolean,
  ): Type<DiscoveryIdpAdapterMongoDTO | NoDiscoveryIdpAdapterMongoDTO> {
    return discovery
      ? DiscoveryIdpAdapterMongoDTO
      : NoDiscoveryIdpAdapterMongoDTO;
  }
}
