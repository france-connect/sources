/* istanbul ignore file */

// Tested by DTO
import { CsmrHsmConfig } from '@fc/csmr-hsm';

import CryptographyBroker from './cryptography-broker';
import Hsm from './hsm';
import Logger from './logger';
import LoggerLegacy from './logger-legacy';

export default {
  Logger,
  LoggerLegacy,
  Hsm,
  CryptographyBroker,
} as CsmrHsmConfig;
