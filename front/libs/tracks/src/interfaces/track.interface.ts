import { DateTime } from 'luxon';

export interface Track {
  accountId: string;
  city: string;
  country: string;
  date: string;
  event: string;
  spAcr: string;
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
