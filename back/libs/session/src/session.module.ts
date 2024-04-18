/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';
import { CryptographyModule } from '@fc/cryptography';
import { RedisModule } from '@fc/redis';

import { SessionConfig } from './dto';
import { SessionCommitInterceptor } from './interceptors';
import { SessionMiddleware } from './middlewares';
import { SessionService, SessionTemplateService } from './services';
import { SessionBackendStorageService } from './services/session-backend-storage.service';
import { SessionCookiesService } from './services/session-cookies.service';
import { SessionLifecycleService } from './services/session-lifecycle.service';
import { SessionLocalStorageService } from './services/session-local-storage.service';

@Global()
@Module({
  imports: [AsyncLocalStorageModule, RedisModule, CryptographyModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionCommitInterceptor,
    },
    SessionService,
    SessionTemplateService,
    SessionBackendStorageService,
    SessionLocalStorageService,
    SessionCookiesService,
    SessionLifecycleService,
  ],
  exports: [
    SessionService,
    SessionTemplateService,
    SessionLocalStorageService,
    SessionBackendStorageService,
    SessionCookiesService,
    SessionLifecycleService,
  ],
})
export class SessionModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { middlewareExcludedRoutes, middlewareIncludedRoutes } =
      this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...middlewareExcludedRoutes)
      .forRoutes(...middlewareIncludedRoutes);
  }
}
