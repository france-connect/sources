/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';

import {
  AsyncLocalStorageMiddleware,
  AsyncLocalStorageRequestMiddleware,
} from '@fc/async-local-storage';

import { AsyncLocalStorageService } from './async-local-storage.service';

@Module({
  providers: [AsyncLocalStorageService],
  exports: [AsyncLocalStorageService],
})
@Global()
export class AsyncLocalStorageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsyncLocalStorageMiddleware, AsyncLocalStorageRequestMiddleware)
      .forRoutes('*');
  }
}
