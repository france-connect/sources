/* istanbul ignore file */

// Declarative file
import { LoggerPluginInterface } from '@fc/logger';

import { LoggerPluginsModule } from '../logger-plugins.module';
import { LoggerDebugService } from '../services';

export const LoggerDebugPlugin: LoggerPluginInterface = {
  imports: [LoggerPluginsModule],
  service: LoggerDebugService,
};
