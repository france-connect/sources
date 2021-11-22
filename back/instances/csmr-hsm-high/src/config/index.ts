/* istanbul ignore file */

// Tested by DTO
import { CsmrHsmConfig } from '@fc/csmr-hsm';

import CryptographyBroker from './cryptography-broker';
import Hsm from './hsm';
import Logger from './logger';

export default {
  Logger,
  Hsm,
  CryptographyBroker,
} as CsmrHsmConfig;
