import * as deepFreeze from 'deep-freeze';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import { GetFqdnToIdentityProviderMongoDto } from '../dto/fqdn-to-idp-mongo.dto';
import { IFqdnToIdentityProviderAdapter } from '../interfaces';
import { FqdnToIdentityProvider } from '../schemas';

@Injectable()
export class FqdnToIdpAdapterMongoService
  implements IFqdnToIdentityProviderAdapter
{
  private fqdnToIdpCache: FqdnToIdentityProvider[];

  constructor(
    @InjectModel('FqdnToIdentityProvider')
    private readonly FqdnToIdentityProviderModel: Model<FqdnToIdentityProvider>,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.mongooseWatcher.watchWith<FqdnToIdentityProvider>(
      this.FqdnToIdentityProviderModel,
      this.refreshCache.bind(this),
    );
    this.logger.debug('Initializing fqdn-to-identity-provider');

    // Warm up cache
    await this.getList();
  }

  /**
   * Return a list of fqdnToIdp
   * for a specific domain
   */
  async getIdpsByDomain(domain: string): Promise<FqdnToIdentityProvider[]> {
    const allfqdnToProvider = await this.getList();
    const fqdnToProviders = allfqdnToProvider.filter(
      (row) => row.domain === domain,
    );

    return fqdnToProviders;
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  /**
   * Get fqdnToIdps from database or from cache,
   * if repository is used, cache is (re)build
   */
  async getList(refreshCache?: boolean): Promise<FqdnToIdentityProvider[]> {
    if (refreshCache || !this.fqdnToIdpCache) {
      this.logger.debug('Refresh FqdnToIdentityProvider cache from DB');

      this.fqdnToIdpCache = deepFreeze(
        await this.fetchFqdnToIdps(),
      ) as FqdnToIdentityProvider[];

      this.logger.trace({
        message: 'fqdnToIdpCache has been refreshed.',
        step: 'REFRESH',
      });
    } else {
      this.logger.trace({
        message: 'fqdnToIdpCache has been used.',
        step: 'CACHE',
      });
    }

    return this.fqdnToIdpCache;
  }

  /**
   * Fetches in Mongo all Idps for all domains
   * in mongo corresponding collection.
   * Then it checks all returned rows with dto validation
   * and eventually returns only validated rows
   */
  private async fetchFqdnToIdps(): Promise<FqdnToIdentityProvider[]> {
    const fqdnToProviderRaw =
      await this.FqdnToIdentityProviderModel.find().lean();

    const fqdnToProvider = await asyncFilter<FqdnToIdentityProvider[]>(
      // because fqdnToProvidr entity == fqdnToProvider dto
      // we don't need to transform fqdnToProviderRow into a dto
      fqdnToProviderRaw,
      async (doc: FqdnToIdentityProvider) => {
        const errors = await validateDto(
          doc,
          GetFqdnToIdentityProviderMongoDto,
          validationOptions,
        );

        if (errors.length > 0) {
          this.logger.warn(
            `fqdnToProvider with domain "${doc.domain}" and provider uuid "${doc.identityProvider}" was excluded from the result at DTO validation.`,
          );
          this.logger.trace({ errors });
        }

        return errors.length === 0;
      },
    );

    this.logger.trace({ fqdnToProvider });
    return fqdnToProvider;
  }
}
