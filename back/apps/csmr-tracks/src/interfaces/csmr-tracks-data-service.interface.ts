/* istanbul ignore file */

// Declarative code

import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksData } from './csmr-tracks-fields-data.interface';

export interface IAppTracksDataService {
  formatTracks(rawTracks: ICsmrTracksData[]): ICsmrTracksOutputTrack[];
}
