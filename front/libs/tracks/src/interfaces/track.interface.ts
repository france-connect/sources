/* istanbul ignore file */

// declarative file
import { DateTime } from 'luxon';

import { FSA } from '@fc/common';

import { CinematicEvents, EidasToLabel } from '../enums';

export interface IProvider {
  key: string;
  label: string;
}

export type IClaim = string;

export interface IRichClaim {
  identifier: IClaim;
  label: string;
  provider: IProvider;
}

export type IPaginationResult = {
  total: number;
  size: number;
  offset: number;
};

export type UserDashboardTracks = FSA<IPaginationResult, Track[]>;

export interface Track {
  city: string;
  claims: IRichClaim[];
  country: string;
  event: CinematicEvents;
  idpLabel: string;
  platform: 'FranceConnect' | 'FranceConnect+';
  spAcr: keyof typeof EidasToLabel;
  spLabel?: string;
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

export type IGroupedClaims = Record<string, { label: string; claims: string[] }>;
