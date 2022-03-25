/* istanbul ignore file */

// Tested by DTO
import { CsmrTracksConfig } from '@fc/csmr-tracks';

import Elasticsearch from './elasticsearch';
import Logger from './logger';
import Mongoose from './mongoose';
import TracksBroker from './tracks-broker';

export default {
  Logger,
  Mongoose,
  TracksBroker,
  Elasticsearch,
} as CsmrTracksConfig;
