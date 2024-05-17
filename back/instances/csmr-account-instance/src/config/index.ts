/* istanbul ignore file */

// Tested by DTO
import { CsmrAccountConfig } from '@fc/csmr-account';

import AccountBroker from './account-broker';
import Logger from './logger';
import Mongoose from './mongoose';

export default {
  Logger,
  Mongoose,
  AccountBroker,
} as CsmrAccountConfig;
