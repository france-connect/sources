import * as deepFreeze from 'deep-freeze';
import { cloneDeep } from 'lodash';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ArrayAsyncHelper, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';
import { IDataProviderAdapter } from '@fc/oidc-client';

import {
  DataProviderAdapterMongoConfig,
  DataProviderAdapterMongoDTO,
} from '../dto';
import {
  DataProviderInvalidCredentialsException,
  DataProviderNotFoundException,
} from '../exceptions';
import { DataProvider } from '../schemas';
import { DataProviderMetadata } from './../interfaces/data-provider-metadata.interface';

@Injectable()
export class DataProviderAdapterMongoService implements IDataProviderAdapter {
  private listCache: DataProviderMetadata[];

  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    @InjectModel(DataProvider.name)
    private readonly dataProviderModel: Model<DataProvider>,
    private readonly cryptography: CryptographyService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly changeStream: MongooseChangeStreamService,
  ) {}

  async onModuleInit() {
    this.changeStream.registerWatcher<DataProvider>(
      this.dataProviderModel,
      this.refreshCache.bind(this),
    );
    // Warm up cache and shows up excluded DPs
    await this.getList();
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  async getList(refreshCache?: boolean): Promise<DataProviderMetadata[]> {
    if (refreshCache || !this.listCache) {
      this.logger.debug('Refresh cache from DB');
      const list = await this.findAllDataProvider();
      this.listCache = deepFreeze(
        list
          .map((listItem) => {
            const clientSecret = this.decryptClientSecret(
              listItem.client_secret,
            );

            if (!clientSecret) {
              this.logger.err({
                msg: `Failed to decrypt client secret for data provider ${listItem.uid}`,
              });

              return null;
            }

            listItem.client_secret = clientSecret;

            return listItem;
          })
          .filter(Boolean),
      ) as DataProviderMetadata[];
    }
    return this.listCache;
  }

  private decryptClientSecret(clientSecret: string): string | null {
    const { clientSecretEncryptKey } =
      this.config.get<DataProviderAdapterMongoConfig>(
        'DataProviderAdapterMongo',
      );

    try {
      return this.cryptography.decryptSymetric(
        clientSecretEncryptKey,
        clientSecret,
      );
    } catch {
      return null;
    }
  }

  private async findAllDataProvider(): Promise<DataProviderMetadata[]> {
    const rawResult = await this.dataProviderModel
      .find(
        {},
        {
          _id: false,
        },
      )
      .lean();

    const dataProviders =
      await ArrayAsyncHelper.filterAsync<DataProviderMetadata>(
        rawResult,
        async (doc: DataProviderMetadata) => {
          const dto = DataProviderAdapterMongoDTO;
          const errors = await validateDto(doc, dto, validationOptions);
          const { uid } = doc;

          if (errors.length > 0) {
            this.logger.alert(
              `Data provider "${uid}" was excluded at DTO validation`,
            );

            this.logger.debug({ errors });
          }

          return errors.length === 0;
        },
      );

    return dataProviders;
  }

  async getById(
    id: string,
    refreshCache?: boolean,
  ): Promise<DataProviderMetadata | undefined> {
    const providers = cloneDeep(await this.getList(refreshCache));

    const provider = providers.find(({ uid }) => uid === id);

    return provider;
  }

  async getByClientId(
    clientId: string,
    refreshCache?: boolean,
  ): Promise<DataProviderMetadata | undefined> {
    const providers = cloneDeep(await this.getList(refreshCache));

    const provider = providers.find(({ client_id }) => client_id === clientId);

    return provider;
  }

  async getAuthenticatedDataProvider(
    clientId: string,
    clientSecret: string,
  ): Promise<DataProviderMetadata> {
    const dataProvider: DataProviderMetadata =
      await this.getByClientId(clientId);

    if (!dataProvider) {
      throw new DataProviderNotFoundException();
    }

    if (dataProvider.client_secret !== clientSecret) {
      throw new DataProviderInvalidCredentialsException();
    }

    return dataProvider;
  }
}
