import type { DateTime } from 'luxon';

import type { FSAInterface } from '@fc/common';
import type { TrackInterface } from '@fc/core-user-dashboard';

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

export type UserDashboardTracks = FSAInterface<TrackInterface[], PaginationResultInterface>;

export interface EnhancedTrackInterface extends TrackInterface {
  // @TODO delete this interface
  // should not add extra properties to TrackInterface
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
