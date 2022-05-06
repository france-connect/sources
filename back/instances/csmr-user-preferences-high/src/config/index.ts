/* istanbul ignore file */

// Tested by DTO
import { CsmrUserPreferencesConfig } from 'apps/csmr-user-preferences/src';

import App from './app';
import Broker from './broker';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import Mailer from './mailer';
import Mongoose from './mongoose';

export default {
  Logger,
  Broker,
  Mongoose,
  IdentityProviderAdapterMongo,
  Mailer,
  App,
} as CsmrUserPreferencesConfig;
