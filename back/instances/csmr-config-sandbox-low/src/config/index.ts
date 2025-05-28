import { CsmrConfigSandboxLowConfig } from '../dto';
import App from './app';
import ConfigBroker from './config-broker';
import ConfigPartnersMicroService from './config-partners-microservice';
import Exceptions from './exceptions';
import Logger from './logger';
import Mongoose from './mongoose';
import ProxyMicroService from './proxy-microservice';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';

export default {
  App,
  Logger,
  ConfigBroker,
  Exceptions,
  Mongoose,
  ServiceProviderAdapterMongo,
  ConfigPartnersMicroService,
  ProxyMicroService,
} as CsmrConfigSandboxLowConfig;
