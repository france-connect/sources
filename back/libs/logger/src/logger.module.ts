/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { LoggerService, NestLoggerService } from './services';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
    {
      provide: NestLoggerService,
      useClass: NestLoggerService,
    },
  ],
  exports: [LoggerService, NestLoggerService],
})
export class LoggerModule {}
