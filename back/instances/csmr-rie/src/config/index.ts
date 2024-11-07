/* istanbul ignore file */

// Tested by DTO

import { CsmrHttpProxyConfig } from '@fc/csmr-http-proxy';

import App from './app';
import Logger from './logger';
import HttpProxyBroker from './rie-broker';

export default {
  App,
  Logger,
  HttpProxyBroker,
} as CsmrHttpProxyConfig;
