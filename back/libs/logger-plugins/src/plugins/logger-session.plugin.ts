import { Module } from '@nestjs/common';

import { LoggerPluginInterface } from '@fc/logger';

import { LoggerSessionService } from '../services';

@Module({
  providers: [LoggerSessionService],
  exports: [LoggerSessionService],
})
export class LoggerSessionPluginsModule {}

export const LoggerSessionPlugin: LoggerPluginInterface = {
  imports: [LoggerSessionPluginsModule],
  service: LoggerSessionService,
};
