import { Module } from '@nestjs/common';

import { LoggerPluginInterface } from '@fc/logger';

import { LoggerRequestService } from './services';

@Module({
  providers: [LoggerRequestService],
  exports: [LoggerRequestService],
})
export class LoggerRequestPluginsModule {}

export const LoggerRequestPlugin: LoggerPluginInterface = {
  imports: [LoggerRequestPluginsModule],
  service: LoggerRequestService,
};
