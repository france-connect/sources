/* istanbul ignore file */

// Tested by DTO
import { CsmrAggregateTracksConfig } from '@fc/csmr-aggregate-tracks';

import AggregateTracksBroker from './aggregate-tracks-broker';
import Logger from './logger';
import TracksHighBroker from './tracks-high-broker';
import TracksLegacyBroker from './tracks-legacy-broker';

export default {
  Logger,
  AggregateTracksBroker,
  TracksHighBroker,
  TracksLegacyBroker,
} as CsmrAggregateTracksConfig;
