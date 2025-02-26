import { CsmrConfigSandboxLowConfig } from '../dto';
import App from './app';
import ConfigBroker from './config-broker';
import Exceptions from './exceptions';
import Logger from './logger';
import Postgres from './postgres';

export default {
  App,
  Logger,
  ConfigBroker,
  Exceptions,
  Postgres,
} as CsmrConfigSandboxLowConfig;
