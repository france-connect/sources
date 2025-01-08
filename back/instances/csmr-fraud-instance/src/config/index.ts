import { CsmrFraudConfig } from '@fc/csmr-fraud';

import AccountHighBroker from './account-high-broker';
import AccountLegacyBroker from './account-legacy-broker';
import App from './app';
import Elasticsearch from './elasticsearch';
import FraudBroker from './fraud-broker';
import GeoipMaxmind from './geoip-maxmind';
import Logger from './logger';
import Mailer from './mailer';

export default {
  App,
  Logger,
  FraudBroker,
  Mailer,
  AccountHighBroker,
  AccountLegacyBroker,
  Elasticsearch,
  GeoipMaxmind,
} as CsmrFraudConfig;
