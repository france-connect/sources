import { ChangeStreamDocument } from 'mongodb';
import { Document, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';

const DEFAULT_OPERATIONS = ['insert', 'update', 'delete', 'rename', 'replace'];

@Injectable()
export class MongooseCollectionOperationWatcherHelper {
  private static listeners = [];

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  watchWith<T extends Document>(model: Model<T>, callback: Function): void {
    MongooseCollectionOperationWatcherHelper.listeners.push({
      model,
      callback,
    });
    this.watch<T>(model, callback);
  }

  private watch<T extends Document>(model: Model<T>, callback: Function): void {
    const watch = model.watch();
    this.logger.debug(
      `database OperationType watcher initialization for ${model.modelName}`,
    );

    watch.on(
      'change',
      this.operationTypeWatcher.bind(this, model.modelName, callback),
    );
  }

  connectAllWatchers() {
    MongooseCollectionOperationWatcherHelper.listeners.forEach(
      ({ model, callback }) => this.watch(model, callback),
    );
  }

  private operationTypeWatcher(
    modelName: string,
    callback: Function,
    stream: ChangeStreamDocument,
  ): void {
    this.logger.trace(`Mongo watcher triggered for ${modelName}`);

    const isListenedOperation = DEFAULT_OPERATIONS.includes(
      stream.operationType,
    );

    if (isListenedOperation) {
      callback();
    }
  }
}
