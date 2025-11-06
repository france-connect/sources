import { Module } from '@nestjs/common';

import { LoggerPluginInterface } from '@fc/logger';

import { LoggerRequestService } from '../services/logger-request.service';

@Module({
  providers: [LoggerRequestService],
  exports: [LoggerRequestService],
})
export class LoggerRequestPluginsModule {}

export const LoggerRequestPlugin: LoggerPluginInterface = {
  imports: [LoggerRequestPluginsModule],
  service: LoggerRequestService,
};
