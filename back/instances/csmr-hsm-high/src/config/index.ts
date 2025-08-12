import { CsmrHsmConfig } from '@fc/csmr-hsm';

import App from './app';
import CryptographyBroker from './cryptography-broker';
import CsmrHsmClientMicroService from './csmr-hsm-client-microservice';
import Hsm from './hsm';
import Logger from './logger';
import LoggerLegacy from './logger-legacy';

export default {
  App,
  Logger,
  LoggerLegacy,
  Hsm,
  CryptographyBroker,
  CsmrHsmClientMicroService,
} as CsmrHsmConfig;
