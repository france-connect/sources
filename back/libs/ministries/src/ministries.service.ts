import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';

import { asyncFilter, validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MinistriesDTO } from './dto';
import { MinistriesOperationTypeChangesEvent } from './events';

@Injectable()
export class MinistriesService {
  private listCache: MinistriesDTO[];

  constructor(
    @InjectModel('Ministries')
    private readonly ministriesModel,
    private readonly eventBus: EventBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.initOperationTypeWatcher();
    this.logger.debug('Initializing ministries');
  }

  /**
   * Listening ministries data update
   */
  private initOperationTypeWatcher(): void {
    const watch: any = this.ministriesModel.watch();
    const msg = "Ministries's database OperationType watcher initialization.";
    this.logger.debug(msg);
    const operationTypeWatcher = this.operationTypeWatcher.bind(this);
    watch.driverChangeStream.cursor.on('data', operationTypeWatcher);
  }

  /**
   * Method triggered when an operation type occured on
   * Mongo's 'ministries' collection.
   * @param {object} stream Stream of event retrieved.
   * @returns {void}
   */
  private operationTypeWatcher(stream): void {
    const operationTypes = ['insert', 'update', 'delete', 'rename', 'replace'];
    const isListenedOperation: boolean = operationTypes.includes(
      stream.operationType,
    );
    if (isListenedOperation) {
      const event = new MinistriesOperationTypeChangesEvent();
      this.eventBus.publish(event);
    }
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
