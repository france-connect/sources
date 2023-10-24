import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import { MinistriesDTO } from './dto';

@Injectable()
export class MinistriesService {
  private listCache: MinistriesDTO[];

  constructor(
    @InjectModel('Ministries')
    private readonly ministriesModel,
    private readonly logger: LoggerService,
    private readonly mongooseWatcher: MongooseCollectionOperationWatcherHelper,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    this.mongooseWatcher.watchWith(
      this.ministriesModel,
      this.refreshCache.bind(this),
    );
    this.logger.debug('Initializing ministries');
  }

  async refreshCache(): Promise<void> {
    await this.getList(true);
  }

  private async findAllMinistries(): Promise<MinistriesDTO[]> {
    const propsOptions = {
      _id: false,
      id: true,
      name: true,
      identityProviders: true,
      sort: true,
    };

    const sortOptions = { sort: { sort: 1 } };
    const rawResult = await this.ministriesModel
      .find({}, propsOptions, sortOptions)
      .exec();

    const results: any = await asyncFilter(rawResult, async ({ _doc }) => {
      const errors = await validateDto(_doc, MinistriesDTO, validationOptions);
      const hasValidationErrors = errors.length > 0;
      if (hasValidationErrors) {
        const errorStack = JSON.stringify(errors);
        const reason = 'was excluded from the result at DTO validation';
        this.logger.warn(`"${_doc.id}" ${reason} ${errorStack}`);
      }
      return !hasValidationErrors;
    });

    return results.map(({ _doc }) => _doc);
  }

  /**
   * @param refreshCache Should we refreshCache the cache made by the service?
   */
  async getList(refreshCache = false): Promise<MinistriesDTO[]> {
    if (refreshCache || !this.listCache) {
      this.listCache = await this.findAllMinistries();
    }
    return this.listCache;
  }
}
