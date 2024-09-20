/* istanbul ignore file */

// Tested by DTO
import { CsmrFraudConfig } from '@fc/csmr-fraud';

import FraudBroker from './fraud-broker';
import Logger from './logger';

export default {
  Logger,
  FraudBroker,
} as CsmrFraudConfig;
