/* istanbul ignore file */

// declarative file
import { DateTime } from 'luxon';

import { EidasToLabel } from '../enums';

export interface Track {
  city: string;
  country: string;
  date: string;
  event: string;
  spAcr: keyof typeof EidasToLabel;
  spName: string;
  trackId: string;
  platform: 'FranceConnect' | 'FranceConnect+';
  claims: string[] | null;
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
