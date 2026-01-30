import { CsmrUserPreferencesConfig } from 'apps/csmr-user-preferences/src';

import App from './app';
import Broker from './broker';
import IdentityProviderAdapterMongo from './identity-provider-adapter-mongo';
import Logger from './logger';
import Mongoose from './mongoose';
import MongooseChangeStream from './mongoose-change-stream';

export default {
  App,
  Logger,
  Broker,
  Mongoose,
  MongooseChangeStream,
  IdentityProviderAdapterMongo,
} as CsmrUserPreferencesConfig;
