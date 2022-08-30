// Stryker disable all
/* istanbul ignore file */

// Declarative code
import { IRichClaim } from '@fc/scopes';

/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   city: 'Paris',
 *   claims:['sub','gender','family_name'] | null
 *   country: 'FR',
 *   event: 'FC_VERIFIED',
 *   idpName: 'Ameli';
 *   platform:'FranceConnect',
 *   spAcr: 'eidas1',
 *   spLabel: 'ANTS',
 *   time: '1647358722235', (millis)
 *   trackId: 'any-unique-track-index-identifier-string-from-ES',
 * }
 */
export interface ICsmrTracksOutputTrack {
  city?: string;
  claims: IRichClaim[];
  country?: string;
  event: string;
  idpLabel?: string;
  platform: string;
  spAcr: string;
  spLabel: string;
  time: number;
  trackId: string;
}
