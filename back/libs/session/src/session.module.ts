/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CryptographyModule } from '@fc/cryptography';
import { RedisModule } from '@fc/redis';

import { SessionInterceptor, SessionTemplateInterceptor } from './interceptors';
import { ISessionOptions } from './interfaces';
import { SessionCsrfService, SessionService } from './services';
import { SESSION_TOKEN_OPTIONS } from './tokens';

@Module({})
export class SessionModule {
  static forRoot(options: ISessionOptions): DynamicModule {
    return {
      global: true,
      module: SessionModule,
      imports: [RedisModule, CryptographyModule],
      providers: [
        {
          provide: SESSION_TOKEN_OPTIONS,
          useValue: options,
        },
        // SessionInterceptor must be instantiate before SessionTemplateInterceptor
        {
          provide: APP_INTERCEPTOR,
          useClass: SessionInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: SessionTemplateInterceptor,
        },
        SessionService,
        SessionCsrfService,
      ],
      exports: [
        SessionService,
        SessionCsrfService,
        RedisModule,
        CryptographyModule,
      ],
    };
  }
}
