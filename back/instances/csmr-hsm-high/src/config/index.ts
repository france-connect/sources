import { CsmrHsmConfig } from '@fc/csmr-hsm';

import App from './app';
import CsmrHsmClientMicroService from './csmr-hsm-client-microservice';
import Hsm from './hsm';
import Logger from './logger';
import LoggerLegacy from './logger-legacy';

export default {
  App,
  Logger,
  LoggerLegacy,
  Hsm,
  CsmrHsmClientMicroService,
} as CsmrHsmConfig;
