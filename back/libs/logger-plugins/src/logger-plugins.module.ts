/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';

import {
  LoggerDebugService,
  LoggerRequestService,
  LoggerSessionService,
} from './services';

@Module({
  providers: [LoggerDebugService, LoggerRequestService, LoggerSessionService],
  exports: [LoggerDebugService, LoggerRequestService, LoggerSessionService],
})
export class LoggerPluginsModule {}
