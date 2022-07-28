/* istanbul ignore file */

// Declarative code
import { IPaginationResult } from '@fc/common';

import { ICsmrTracksOutputTrack } from './csmr-tracks-output-track.interface';

export type TracksResults = {
  meta: IPaginationResult;
  payload: ICsmrTracksOutputTrack[];
};
