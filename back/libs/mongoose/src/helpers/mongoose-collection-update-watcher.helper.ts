import { ChangeStream, ChangeStreamDocument } from 'mongodb';
import { Document, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { ArrayAsyncHelper, FunctionSafe } from '@fc/common';
import { LoggerService } from '@fc/logger';

const DEFAULT_OPERATIONS = ['insert', 'update', 'delete', 'rename', 'replace'];

@Injectable()
export class MongooseCollectionOperationWatcherHelper {
  private listeners = [];

  constructor(private readonly logger: LoggerService) {}

  watchWith<T extends Document>(model: Model<T>, callback: FunctionSafe): void {
    const stream = this.watch<T>(model, callback);
    this.listeners.push({
      model,
      stream,
      callback,
    });
  }

  private watch<T extends Document>(
    model: Model<T>,
    callback: FunctionSafe,
  ): ChangeStream {
    const stream = model.watch();
    this.logger.notice(`Opened change stream for "${model.modelName}".`);

    stream.on('error', this.logError.bind(this, model));

    stream.on('close', this.logClose.bind(this, model));

    stream.on(
      'change',
      this.operationTypeWatcher.bind(this, model.modelName, callback),
    );

    return stream;
  }

  private logError<T>(model: Model<T>, error: Error): void {
    this.logger.err(
      `Error while watching "${model.modelName}" collection: ${error.message}`,
    );
  }

  private logClose<T>(model: Model<T>): void {
    this.logger.notice(
      `Watch on "${model.modelName}" collection closed, reconnecting...`,
    );
  }

  async connectAllWatchers() {
    await this.closeAllWatchers();
    this.listeners.forEach(({ model, callback }) =>
      this.watch(model, callback),
    );
  }

  private operationTypeWatcher(
    modelName: string,
    callback: FunctionSafe,
    stream: ChangeStreamDocument,
  ): void {
    const isListenedOperation = DEFAULT_OPERATIONS.includes(
      stream.operationType,
    );

    if (isListenedOperation) {
      this.logger.notice(
        `Detected "${stream.operationType}" on "${modelName}", calling handler.`,
      );
      callback();
      return;
    }

    this.logger.info(
      `Detected "${stream.operationType}" on "${modelName}", Ignoring.`,
    );
  }

  private async closeAllWatchers() {
    await ArrayAsyncHelper.mapAsync(
      this.listeners,
      async ({ stream, model }) => {
        await stream.close();
        this.logger.notice(`Closed change stream for "${model.modelName}".`);
      },
    );
  }
}
