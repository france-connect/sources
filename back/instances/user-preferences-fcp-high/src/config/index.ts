/* istanbul ignore file */

// Tested by DTO
import { UserPreferencesFcpConfig } from '@fc/user-preferences-fcp';

import Broker from './broker';
import Logger from './logger';
import Mongoose from './mongoose';

export default {
  Logger,
  Broker,
  Mongoose,
} as UserPreferencesFcpConfig;
