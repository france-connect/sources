/* istanbul ignore file */

// Declarative code
import { MockServiceProviderConfig } from '@fc/mock-service-provider';

import App from './app';
import Logger from './logger';
import Redis from './redis';
import Session from './session';

export default {
  App,
  Logger,
  Redis,
  Session,
} as MockServiceProviderConfig;
