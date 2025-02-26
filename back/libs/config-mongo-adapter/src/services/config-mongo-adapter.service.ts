import { Model } from 'mongoose';
import { ConditionalPick } from 'type-fest';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { ConfigDatabaseServiceInterface } from '@fc/csmr-config/interfaces';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import {
  OidcClientLegacyInterface,
  ServiceProviderService,
} from '@fc/service-provider';
import {
  ServiceProvider,
  ServiceProviderAdapterMongoConfig,
} from '@fc/service-provider-adapter-mongo';

@Injectable()
export class ConfigMongoAdapterService
  implements ConfigDatabaseServiceInterface
{
  constructor(
    private readonly config: ConfigService,
    private readonly cryptography: CryptographyService,
    @InjectModel('ServiceProvider')
    private readonly serviceProviderModel: Model<ServiceProvider>,
    private readonly serviceProvider: ServiceProviderService,
  ) {}

  async create(message: ConfigMessageDto): Promise<string> {
    return await this.save(message);
  }

  async update(message: ConfigMessageDto): Promise<string> {
    return await this.save(message);
  }

  private async save(message: ConfigMessageDto): Promise<string> {
    const { client_secret } = message.payload;
    /**
     * @todo decrypt client_secret with partner's secret
     * before encrypting it with core's secret
     */
    const encryptedSecret = this.encryptClientSecret(client_secret);
    const legacyFormat = this.serviceProvider.toLegacy(message.payload);
    const data = this.patchPartnerForMongo(legacyFormat);

    const document = await this.serviceProviderModel.findOneAndUpdate(
      { key: data.key },
      {
        ...data,
        client_secret: encryptedSecret,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return document.id;
  }

  private patchPartnerForMongo(
    input: Partial<OidcClientLegacyInterface>,
  ): Partial<OidcClientLegacyInterface> {
    const output = {
      ...input,
      entityId: input.entityId || input.key,
      title: input.title || input.name,
      userinfo_signed_response_alg: input.id_token_signed_response_alg,
    };

    this.castStringToArray(output, 'redirect_uris');
    this.castStringToArray(output, 'post_logout_redirect_uris');
    this.castStringToArray(output, 'site');
    return output;
  }

  /**
   * @todo #1985
   * Temporary workaround for properties that should be arrays but are strings
   */
  private castStringToArray(
    input: Partial<OidcClientLegacyInterface>,
    propertyName: keyof ConditionalPick<OidcClientLegacyInterface, string[]>,
  ): void {
    if (typeof input[propertyName] === 'string') {
      input[propertyName] = [input[propertyName]];
    }
  }

  private encryptClientSecret(clientSecret: string): string {
    const { clientSecretEncryptKey } =
      this.config.get<ServiceProviderAdapterMongoConfig>(
        'ServiceProviderAdapterMongo',
      );
    return this.cryptography.encryptSymetric(
      clientSecretEncryptKey,
      clientSecret,
    );
  }
}
