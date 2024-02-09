import * as deepFreeze from 'deep-freeze';
import { cloneDeep } from 'lodash';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';
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
    @InjectModel('DataProvider')
    private readonly dataProviderModel: Model<DataProvider>,
    private readonly cryptography: CryptographyService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {}

  async onModuleInit() {
    this.mongooseWatcher.watchWith(
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
        list.map((listItem) => {
          listItem.client_secret = this.decryptClientSecret(
            listItem.client_secret,
          );
          return listItem;
        }),
      ) as DataProviderMetadata[];
    }
    return this.listCache;
  }

  private decryptClientSecret(clientSecret: string): string {
    const { clientSecretEncryptKey } =
      this.config.get<DataProviderAdapterMongoConfig>(
        'DataProviderAdapterMongo',
      );

    return this.cryptography.decryptSymetric(
      clientSecretEncryptKey,
      clientSecret,
    );
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

    const dataProviders = await asyncFilter<DataProviderMetadata[]>(
      rawResult,
      async (doc: DataProviderMetadata) => {
        const dto = DataProviderAdapterMongoDTO;
        const errors = await validateDto(doc, dto, validationOptions);

        if (errors.length > 0) {
          this.logger.warning(
            `"${doc.uid}" was excluded from the result at DTO validation.`,
          );
        }

        return errors.length === 0;
      },
    );

    return dataProviders;
  }

  async getById(
    id: string,
    refreshCache?: boolean,
  ): Promise<DataProviderMetadata> {
    const providers = cloneDeep(await this.getList(refreshCache));

    const provider = providers.find(({ uid }) => uid === id);

    return provider;
  }

  async getByClientId(
    clientId: string,
    refreshCache?: boolean,
  ): Promise<DataProviderMetadata> {
    const providers = cloneDeep(await this.getList(refreshCache));

    // eslint-disable-next-line @typescript-eslint/naming-convention
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

    // oidc property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    if (dataProvider.client_secret !== clientSecret) {
      throw new DataProviderInvalidCredentialsException();
    }

    return dataProvider;
  }
}
