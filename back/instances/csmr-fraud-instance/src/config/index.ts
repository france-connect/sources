/* istanbul ignore file */

// Tested by DTO
import { CsmrFraudConfig } from '@fc/csmr-fraud';

import App from './app';
import FraudBroker from './fraud-broker';
import Logger from './logger';
import Mailer from './mailer';

export default {
  App,
  Logger,
  FraudBroker,
  Mailer,
} as CsmrFraudConfig;
