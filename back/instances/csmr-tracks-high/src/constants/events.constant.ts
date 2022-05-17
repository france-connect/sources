/* istanbul ignore file */

// Declarative code
import { ICsmrTracksHighTrack } from '../interfaces';

export const EVENTS_TO_INCLUDE: Partial<ICsmrTracksHighTrack>[] = [
  {
    event: 'FC_VERIFIED',
  },
  {
    event: 'FC_DATATRANSFER_CONSENT_IDENTITY',
  },
  {
    event: 'FC_DATATRANSFER_CONSENT_DATA',
  },
  {
    event: 'DP_REQUESTED_FC_CHECKTOKEN',
  },
];
