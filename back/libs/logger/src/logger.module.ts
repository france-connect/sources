/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
