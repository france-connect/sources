import * as deepFreeze from 'deep-freeze';
import { cloneDeep } from 'lodash';

import { Injectable } from '@nestjs/common';

import { ArrayAsyncHelper, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';
import { IIdentityProviderAdapter } from '@fc/oidc-client';

import {
  IdentityProviderAdapter,
  IdentityProviderAdapterEnvConfig,
  IdentityProviderAdapterEnvDTO,
} from './dto';
import { IIdentityProviderAdapterEnv } from './interfaces';

@Injectable()
export class IdentityProviderAdapterEnvService
  implements IIdentityProviderAdapter
{
  private identityProviderCache: IdentityProviderMetadata[];

  constructor(
    private readonly cryptography: CryptographyService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  private async findAllIdentityProvider(): Promise<
    IIdentityProviderAdapterEnv[]
  > {
    const { list } = this.config.get<IdentityProviderAdapterEnvConfig>(
      'IdentityProviderAdapterEnv',
    );

    const result = await ArrayAsyncHelper.filterAsync<IdentityProviderAdapter>(
      list,
      async ({
        clientSecretEncryptKey: _clientSecretEncryptKey,
        ...configuration
      }) => {
        const errors = await validateDto(
          configuration,
          IdentityProviderAdapterEnvDTO,
          validationOptions,
        );

        if (errors.length > 0) {
          this.logger.warning(
            `"${configuration.uid}" was excluded from the result at DTO validation`,
            JSON.stringify(errors),
          );
        }

        return errors.length === 0;
      },
    );

    return result;
  }

  /**
   * Get the list of IdentityProviderMetadata, optionally refreshing the cache.
   *
   * @param {boolean} [refreshCache=false] - Whether to refresh the cache made by the service
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

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  /**
   * Method triggered when you want to filter identity providers
   * from service providers' whitelist/blacklist
   *
   * @param idpList  list of identity providers' clientID
   * @param blacklist  boolean false = blacklist true = whitelist
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

  async isActiveById(id: string): Promise<boolean> {
    const idp = await this.getById(id);

    return Boolean(idp?.active);
  }

  private legacyToOpenIdPropertyName(
    list: IdentityProviderAdapter,
  ): IIdentityProviderAdapterEnv {
    const { clientSecretEncryptKey, ...configuration } = list;

    const client_secret = this.decryptClientSecret(
      configuration.client.client_secret,
      clientSecretEncryptKey,
    );

    const clientLegacyToOpenId = {
      ...configuration.client,
      client_secret,
    };

    return { ...configuration, client: clientLegacyToOpenId };
  }

  /**
   * Decrypt client secret with specific key provided by configuration
   *
   * @param clientSecret
   * @param clientSecretEncryptKey
   */
  private decryptClientSecret(
    clientSecret: string,
    clientSecretEncryptKey: string,
  ): string {
    return this.cryptography.decrypt(
      clientSecretEncryptKey,
      Buffer.from(clientSecret, 'base64'),
    );
  }
}
