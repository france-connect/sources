import { Module } from '@nestjs/common';

import { LoggerPluginInterface } from '@fc/logger';

import { LoggerOidcProviderService } from './services';

@Module({
  providers: [LoggerOidcProviderService],
  exports: [LoggerOidcProviderService],
})
export class LoggerOidcProviderPluginsModule {}

export const LoggerOidcProviderPlugin: LoggerPluginInterface = {
  imports: [LoggerOidcProviderPluginsModule],
  service: LoggerOidcProviderService,
};
