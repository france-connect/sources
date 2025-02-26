import { CsmrTracksConfig } from '@fc/csmr-tracks';

import AccountHighBroker from './account-high-broker';
import AccountLegacyBroker from './account-legacy-broker';
import App from './app';
import Elasticsearch from './elasticsearch';
import Logger from './logger';
import IdpMappings from './mappings';
import ScopesFcLegacy from './scopes-fc-legacy';
import ScopesFcpHigh from './scopes-fcp-high';
import ScopesFcpLow from './scopes-fcp-low';
import TracksBroker from './tracks-broker';

export default {
  App,
  AccountHighBroker,
  AccountLegacyBroker,
  Logger,
  Elasticsearch,
  TracksBroker,
  ScopesFcLegacy,
  ScopesFcpHigh,
  ScopesFcpLow,
  IdpMappings,
} as CsmrTracksConfig;
