/* istanbul ignore file */

// Tested by DTO
import { CsmrUserPreferencesConfig } from 'apps/csmr-user-preferences/src';

import App from './app';
import Broker from './broker';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import Mongoose from './mongoose';

export default {
  App,
  Logger,
  Broker,
  Mongoose,
  IdentityProviderAdapterMongo,
} as CsmrUserPreferencesConfig;
