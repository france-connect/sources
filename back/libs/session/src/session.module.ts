/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';
import { CryptographyModule } from '@fc/cryptography';
import { RedisModule } from '@fc/redis';

import { SessionConfig } from './dto';
import {
  SessionCommitInterceptor,
  SessionTemplateInterceptor,
} from './interceptors';
import { SessionMiddleware } from './middlewares';
import {
  SessionCsrfService,
  SessionService,
  SessionTemplateService,
} from './services';

@Global()
@Module({
  imports: [AsyncLocalStorageModule, RedisModule, CryptographyModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionTemplateInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionCommitInterceptor,
    },
    SessionService,
    SessionCsrfService,
    SessionTemplateService,
  ],
  exports: [
    SessionService,
    SessionTemplateService,
    SessionCsrfService,
    RedisModule,
    CryptographyModule,
  ],
})
export class SessionModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
