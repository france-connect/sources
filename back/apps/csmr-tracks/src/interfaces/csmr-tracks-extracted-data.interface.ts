/* istanbul ignore file */

// Declarative code
import { ICsmrTracksOutputTrack } from '@fc/tracks';

export type ICsmrTracksExtractedData = Omit<
  ICsmrTracksOutputTrack,
  'platform' | 'trackId'
>;
