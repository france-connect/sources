/* istanbul ignore file */

// Tested by DTO
import { BridgeHttpProxyConfig } from '@fc/bridge-http-proxy';

import App from './app';
import Logger from './logger';
import BridgeProxyBroker from './rie-broker';

export default {
  App,
  Logger,
  BridgeProxyBroker,
} as BridgeHttpProxyConfig;
