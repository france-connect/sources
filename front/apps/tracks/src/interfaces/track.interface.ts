import type { DateTime } from 'luxon';

import type { FSAInterface } from '@fc/common';

import type { CinematicEvents, EidasToLabel } from '../enums';

interface ProviderInterface {
  slug: string;
  label: string;
}

export type IClaim = string;

export interface RichClaimInterface {
  identifier: IClaim;
  label: string;
  provider: ProviderInterface;
}

export type PaginationResultInterface = {
  total: number;
  size: number;
  offset: number;
};

export type UserDashboardTracks = FSAInterface<PaginationResultInterface, TrackInterface[]>;

export interface TrackInterface {
  city: string;
  claims: RichClaimInterface[];
  country: string;
  event: CinematicEvents;
  idpLabel: string;
  platform: 'FranceConnect' | 'FranceConnect+';
  interactionAcr: keyof typeof EidasToLabel;
  spLabel?: string;
  authenticationEventId: string;
  time: number;
  trackId: string;
}

export interface EnhancedTrackInterface extends TrackInterface {
  datetime: DateTime;
}

export type TrackListType = [
  number,
  {
    label: string;
    tracks: EnhancedTrackInterface[];
  },
];

export type IGroupedClaims = Record<string, { label: string; claims: string[] }>;
