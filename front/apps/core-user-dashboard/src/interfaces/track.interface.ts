import type { Platforms } from '@fc/common';
import type { RichClaimInterface } from '@fc/tracks';
import type { CinematicEvents, EidasToLabel } from '@fc/tracks/src/enums';

export interface TrackInterface {
  city: string;
  claims: RichClaimInterface[];
  country: string;
  event: CinematicEvents;
  idpLabel: string;
  platform: Platforms;
  interactionAcr: keyof typeof EidasToLabel;
  spLabel?: string;
  authenticationEventId: string;
  time: number;
  trackId: string;
}
