/* istanbul ignore file */

// Declarative code

import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksData } from './csmr-tracks-fields-data.interface';

export interface TracksFormatterInterface {
  formatTrack(rawTrack: SearchHit<ICsmrTracksData>): ICsmrTracksOutputTrack;
}
