/* istanbul ignore file */

// Tested by DTO

import { CsmrTracksConfig } from '@fc/csmr-tracks';

import AccountHighBroker from './account-high-broker';
import AccountLegacyBroker from './account-legacy-broker';
import Elasticsearch from './elasticsearch';
import GeoipMaxmind from './geoip-maxmind';
import Logger from './logger';
import IdpMappings from './mappings';
import ScopesFcLegacy from './scopes-fc-legacy';
import ScopesFcpHigh from './scopes-fcp-high';
import ScopesFcpLow from './scopes-fcp-low';
import TracksBroker from './tracks-broker';

export default {
  AccountHighBroker,
  AccountLegacyBroker,
  Logger,
  Elasticsearch,
  TracksBroker,
  ScopesFcLegacy,
  ScopesFcpHigh,
  ScopesFcpLow,
  GeoipMaxmind,
  IdpMappings,
} as CsmrTracksConfig;
