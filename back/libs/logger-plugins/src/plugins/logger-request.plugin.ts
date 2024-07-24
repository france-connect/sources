/* istanbul ignore file */

// Declarative file
import { LoggerPluginInterface } from '@fc/logger';

import { LoggerPluginsModule } from '../logger-plugins.module';
import { LoggerRequestService } from '../services';

export const LoggerRequestPlugin: LoggerPluginInterface = {
  imports: [LoggerPluginsModule],
  service: LoggerRequestService,
};
