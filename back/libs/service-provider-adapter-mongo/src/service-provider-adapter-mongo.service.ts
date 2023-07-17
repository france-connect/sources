import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';
import { IServiceProviderAdapter, ServiceProviderMetadata } from '@fc/oidc';

import {
  ServiceProviderAdapterMongoConfig,
  ServiceProviderAdapterMongoDTO,
} from './dto';
import { Types } from './enums';
import { MongoRequestFilterArgument } from './interfaces';
import { ServiceProvider } from './schemas';

@Injectable()
export class ServiceProviderAdapterMongoService
  implements IServiceProviderAdapter
{
  private listCache: ServiceProviderMetadata[];

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    @InjectModel('ServiceProvider')
    private readonly serviceProviderModel: Model<ServiceProvider>,
    private readonly cryptography: CryptographyService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.mongooseWatcher.watchWith<ServiceProvider>(
      this.serviceProviderModel,
      this.refreshCache.bind(this),
    );
    this.logger.debug('Initializing service-provider');
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  private async findAllServiceProvider(): Promise<ServiceProviderMetadata[]> {
    const { platform } = this.config.get<ServiceProviderAdapterMongoConfig>(
      'ServiceProviderAdapterMongo',
    );

    const requestFilterArgument: MongoRequestFilterArgument = {
      active: true,
    };

    if (platform) {
      requestFilterArgument.platform = platform;
    }

    const rawResult = await this.serviceProviderModel
      .find(requestFilterArgument, {
        _id: false,
        active: true,
        name: true,
        title: true,
        key: true,
        entityId: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: true,
        scopes: true,
        claims: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uris: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        post_logout_redirect_uris: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_signed_response_alg: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_encrypted_response_alg: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_encrypted_response_enc: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userinfo_signed_response_alg: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userinfo_encrypted_response_alg: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userinfo_encrypted_response_enc: true,
        // openid defined property names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwks_uri: true,
        idpFilterExclude: true,
        idpFilterList: true,
        type: true,
        identityConsent: true,
        ssoDisabled: true,
        platform: true,
      })
      .lean();

    const serviceProviders = await asyncFilter<ServiceProviderMetadata[]>(
      rawResult,
      async (doc: ServiceProviderMetadata) => {
        const { name } = doc;

        const errors = await validateDto(
          doc,
          ServiceProviderAdapterMongoDTO,
          validationOptions,
        );

        if (errors.length > 0) {
          this.logger.trace({ errors }, LoggerLevelNames.WARN);
          this.logger.warn(
            `"${name}" was excluded from the result at DTO validation :${JSON.stringify(
              errors,
              null,
              2,
            )}`,
          );
        }

        return errors.length === 0;
      },
    );

    return serviceProviders;
  }

  /**
   * @param refreshCache  Should we refreshCache the cache made by the service?
   */
  async getList(refreshCache = false): Promise<ServiceProviderMetadata[]> {
    if (refreshCache || !this.listCache) {
      this.logger.debug('Refresh cache from DB');

      const list = await this.findAllServiceProvider();
      this.listCache = list.map(this.legacyToOpenIdPropertyName.bind(this));

      this.logger.trace({ step: 'REFRESH', list, listCache: this.listCache });
    } else {
      this.logger.trace({ step: 'CACHE', listCache: this.listCache });
    }

    return this.listCache;
  }

  async getById(
    spId: string,
    refreshCache = false,
  ): Promise<ServiceProviderMetadata> {
    const list = await this.getList(refreshCache);
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const serviceProvider: ServiceProviderMetadata = list.find(
      ({ client_id: dbId }) => dbId === spId,
    );

    this.logger.trace({ spId, refreshCache, serviceProvider });

    return serviceProvider;
  }

  /**
   * Method triggered when you want to filter or check if
   * an identity provider is blacklisted or whitelisted
   * @param spId service provider ID
   * @param idpId identity provider ID
   */
  async shouldExcludeIdp(spId: string, idpId: string): Promise<boolean> {
    const { idpFilterExclude, idpFilterList } = await this.getById(spId);
    const idpFound = idpFilterList.includes(idpId);

    return idpFilterExclude ? idpFound : !idpFound;
  }

  private legacyToOpenIdPropertyName(
    source: ServiceProvider,
  ): ServiceProviderMetadata {
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const client_id = source.key;
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const client_secret = this.decryptClientSecret(source.client_secret);
    const scope = source.scopes.join(' ');

    const result = {
      ...source,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret,
      scope,
    };

    delete result.key;
    delete result.scopes;

    return result as ServiceProviderMetadata;
  }

  private decryptClientSecret(clientSecret: string): string {
    const { clientSecretEncryptKey } =
      this.config.get<ServiceProviderAdapterMongoConfig>(
        'ServiceProviderAdapterMongo',
      );
    return this.cryptography.decrypt(
      clientSecretEncryptKey,
      Buffer.from(clientSecret, 'base64'),
    );
  }

  consentRequired(type, identityConsent) {
    return type === Types.PRIVATE && identityConsent;
  }
}
