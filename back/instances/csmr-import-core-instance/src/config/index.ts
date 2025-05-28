import { CsmrImportCoreConfig } from '@fc/csmr-import-core';

import App from './app';
import CsmrHsmClientMicroService from './csmr-hsm-client-microservice';
import DefaultServiceProviderLowValue from './default-service-provider-low-value';
import ImportCoreBroker from './import-core-broker';
import Logger from './logger';
import Mongoose from './mongoose';
import ScopesFcpLow from './scopes-fcp-low';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';

export default {
  App,
  Logger,
  ImportCoreBroker,
  CsmrHsmClientMicroService,
  Mongoose,
  ServiceProviderAdapterMongo,
  DefaultServiceProviderLowValue,
  ScopesFcpLow,
} as CsmrImportCoreConfig;
