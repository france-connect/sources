import { Connection, Document, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { FunctionSafe } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { OPERATIONS_TO_WATCH } from '../constants';
import {
  ChangeStreamCompatibleDocument,
  CollectionsToWatchType,
} from '../types';

@Injectable()
export class MongooseChangeStreamService {
  private changeStream = null;
  private collectionsToWatch = new Map<string, CollectionsToWatchType>();

  constructor(
    private readonly logger: LoggerService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  onApplicationBootstrap() {
    this.watchChangeStream();
  }

  async onModuleDestroy() {
    await this.closeChangeStream();
  }

  registerWatcher<T extends Document>(
    model: Model<T>,
    callback: FunctionSafe,
  ): void {
    const { collection, modelName } = model;
    const { collectionName } = collection;

    this.collectionsToWatch.set(collectionName, {
      callback,
      modelName,
    });

    this.logger.info(
      `Watcher registered for "${modelName}" ("${collectionName}" collection).`,
    );
  }

  async reopenChangeStream(): Promise<void> {
    this.logger.notice('Reopening the Change Stream...');
    await this.closeChangeStream();
    this.watchChangeStream();
  }

  private watchChangeStream(): void {
    const collections = Array.from(this.collectionsToWatch.keys());

    if (collections.length === 0) {
      this.logger.warning('No collections to watch.');
      return;
    }

    const pipeline = this.buildChangeStreamPipeline(collections);

    this.logger.debug({ pipeline }, 'Pipeline built for change streams');

    this.changeStream = this.connection.watch(pipeline);
    this.changeStream.on('change', this.onChange.bind(this));
    this.changeStream.on('error', this.onError.bind(this));
    this.changeStream.on('close', this.onClose.bind(this));

    const watchedCollections = Array.from(this.collectionsToWatch.keys());
    this.logger.notice(
      `Change streams initialized with collections: ${watchedCollections.join(', ')}`,
    );
  }

  private onChange(event: ChangeStreamCompatibleDocument): void {
    const { callback, modelName } = this.collectionsToWatch.get(event.ns.coll);

    this.logger.notice(
      `Detected "${event.operationType}" on "${modelName}", calling handler.`,
    );

    callback(event);
  }

  private async onError(error: Error): Promise<void> {
    this.logger.err(`Error on changeStream: ${error.message}`);

    await this.reopenChangeStream();
  }

  private async onClose(): Promise<void> {
    this.logger.notice(`ChangeStream closed`);

    await this.reopenChangeStream();
  }

  private async closeChangeStream() {
    if (this.changeStream) {
      this.logger.info('Closing ChangeStream...');
      await this.changeStream.close();
      this.logger.notice('ChangeStream closed.');
    } else {
      this.logger.notice('No ChangeStream to close.');
    }

    this.changeStream = null;
  }

  private buildChangeStreamPipeline(collections: string[]) {
    const pipeline = [
      {
        $match: {
          operationType: {
            $in: OPERATIONS_TO_WATCH,
          },
          'ns.coll': { $in: collections },
        },
      },
    ];

    return pipeline;
  }
}
