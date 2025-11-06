import { WEBHOOK_NAME } from '../constants';
import { ImportSpSandboxConfig } from '../dto';
import App from './app';
import ConfigSandboxLowMicroService from './config-sandbox-low-microservice';
import Logger from './logger';
import Mongoose from './mongoose';
import ServiceProviderAdapterMongo from './service-provider-adapter-mongo';
import WebhooksInvitation from './webhooks-invitation';

export default {
  App,
  ConfigSandboxLowMicroService,
  Logger,
  Mongoose,
  ServiceProviderAdapterMongo,
  [WEBHOOK_NAME]: WebhooksInvitation,
} as ImportSpSandboxConfig;
