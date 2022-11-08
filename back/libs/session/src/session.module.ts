/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { RedisModule } from '@fc/redis';

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
