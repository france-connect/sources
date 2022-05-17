/* istanbul ignore file */

// Tested by DTO

import { CsmrTracksHighConfig } from '../dto';
import Elasticsearch from './elasticsearch';
import GeoipMaxmind from './geoip-maxmind';
import Logger from './logger';
import IdpMappings from './mappings';
import Mongoose from './mongoose';
import Scopes from './scopes';
import TracksBroker from './tracks-broker';

export default {
  Logger,
  Mongoose,
  Scopes,
  TracksBroker,
  GeoipMaxmind,
  Elasticsearch,
  IdpMappings,
} as CsmrTracksHighConfig;
