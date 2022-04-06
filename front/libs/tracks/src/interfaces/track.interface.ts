/* istanbul ignore file */

// declarative file
import { DateTime } from 'luxon';

import { EidasToLabel } from '../enums';

export interface Track {
  city: string;
  claims: string[] | null;
  country: string;
  event: string;
  idpName: string;
  platform: 'FranceConnect' | 'FranceConnect+';
  spAcr: keyof typeof EidasToLabel;
  spName?: string;
  time: number;
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
