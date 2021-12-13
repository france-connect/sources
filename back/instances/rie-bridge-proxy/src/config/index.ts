/* istanbul ignore file */

// Tested by DTO
import { RieBridgeProxyConfig } from '@fc/rie-bridge-proxy';

import App from './app';
import Logger from './logger';
import BridgeProxyBroker from './rie-broker';

export default {
  App,
  Logger,
  BridgeProxyBroker,
} as RieBridgeProxyConfig;
