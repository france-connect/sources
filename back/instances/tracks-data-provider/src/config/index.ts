/* istanbul ignore file */

// Declarative code
import { TracksDataProviderConfig } from '@fc/tracks-data-provider';

import App from './app';
import DataProviderCoreAuth from './data-provider-core-auth';
import Logger from './logger';
import TracksBroker from './tracks-broker';

export default {
  App,
  DataProviderCoreAuth,
  Logger,
  TracksBroker,
} as TracksDataProviderConfig;
