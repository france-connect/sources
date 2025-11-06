import { CsmrFraudConfig } from '@fc/csmr-fraud';

import AccountHighBroker from './account-high-broker';
import AccountLegacyBroker from './account-legacy-broker';
import App from './app';
import Elasticsearch from './elasticsearch';
import FraudBroker from './fraud-broker';
import Logger from './logger';
import Mailer from './mailer';
import IdpMappings from './mappings';

export default {
  App,
  Logger,
  FraudBroker,
  Mailer,
  AccountHighBroker,
  AccountLegacyBroker,
  Elasticsearch,
  IdpMappings,
} as CsmrFraudConfig;
