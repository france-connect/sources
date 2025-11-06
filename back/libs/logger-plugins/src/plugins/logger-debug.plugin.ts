import { Module } from '@nestjs/common';

import { LoggerPluginInterface } from '@fc/logger';

import { LoggerDebugService } from '../services';

@Module({
  providers: [LoggerDebugService],
  exports: [LoggerDebugService],
})
export class LoggerDebugPluginsModule {}

export const LoggerDebugPlugin: LoggerPluginInterface = {
  imports: [LoggerDebugPluginsModule],
  service: LoggerDebugService,
};
