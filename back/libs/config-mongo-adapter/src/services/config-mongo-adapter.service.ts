import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { objectDiff } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ConfigDatabaseServiceInterface,
  ConfigSaveResultInterface,
  diffKeys,
} from '@fc/config-abstract-adapter';
import { CryptographyService } from '@fc/cryptography';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import {
  OidcClientInterface,
  OidcClientLegacyInterface,
  ServiceProviderService,
} from '@fc/service-provider';
import {
  ServiceProvider,
  ServiceProviderAdapterMongoConfig,
} from '@fc/service-provider-adapter-mongo';

import { QueryInterface } from '../interfaces';

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

  async create(message: ConfigMessageDto): Promise<ConfigSaveResultInterface> {
    return await this.save(message);
  }

  async update(message: ConfigMessageDto): Promise<ConfigSaveResultInterface> {
    return await this.save(message);
  }

  async findOneSpByQuery(
    query: QueryInterface,
  ): Promise<ServiceProvider | null> {
    const document = await this.serviceProviderModel.findOne(query);

    return document;
  }

  private async save(
    message: ConfigMessageDto,
  ): Promise<ConfigSaveResultInterface> {
    const { client_secret } = message.payload;
    /**
     * @todo decrypt client_secret with partner's secret
     * before encrypting it with core's secret
     */
    const encryptedSecret = this.encryptClientSecret(client_secret);
    const legacyFormat = this.serviceProvider.toLegacy(message.payload);
    const data = this.patchPartnerForMongo(legacyFormat);

    const diff = await this.getDiff(message);

    const document = await this.serviceProviderModel.findOneAndReplace(
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

    return {
      id: document.key,
      diff,
    };
  }

  private async getDiff(message: ConfigMessageDto): Promise<diffKeys> {
    const { client_id: key } = message.payload;
    const oldDocument = await this.serviceProviderModel.findOne({
      key,
    });

    if (!oldDocument) {
      return Object.keys(message.payload) as diffKeys;
    }

    const diff = objectDiff<OidcClientInterface>(
      this.serviceProvider.fromLegacy(oldDocument),
      message.payload,
    );

    return diff;
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

    return output;
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
