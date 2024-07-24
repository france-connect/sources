/* istanbul ignore file */

// Declarative file
import { LoggerPluginInterface } from '@fc/logger';

import { LoggerPluginsModule } from '../logger-plugins.module';
import { LoggerSessionService } from '../services';

export const LoggerSessionPlugin: LoggerPluginInterface = {
  imports: [LoggerPluginsModule],
  service: LoggerSessionService,
};
