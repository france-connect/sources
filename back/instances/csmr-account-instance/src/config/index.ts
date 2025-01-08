import { CsmrAccountConfig } from '@fc/csmr-account';

import AccountBroker from './account-broker';
import App from './app';
import Logger from './logger';
import Mongoose from './mongoose';

export default {
  App,
  Logger,
  Mongoose,
  AccountBroker,
} as CsmrAccountConfig;
