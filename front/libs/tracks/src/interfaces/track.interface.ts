/* istanbul ignore file */

// declarative file
import { DateTime } from 'luxon';

import { EidasToLabel } from '../enums';

export interface Track {
  accountId: string;
  city: string;
  country: string;
  date: string;
  event: string;
  spAcr: keyof typeof EidasToLabel;
  spId: string;
  spName: string;
  trackId: string;
}

export interface EnhancedTrack extends Track {
  datetime: DateTime;
}

export type TrackList = [
  number,
  {
    label: string;
    tracks: EnhancedTrack[];
  },
];
