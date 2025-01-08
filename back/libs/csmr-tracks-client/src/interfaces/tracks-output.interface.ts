import { RichClaimInterface } from '@fc/scopes';
import { TracksFormatterOutputAbstract } from '@fc/tracks-adapter-elasticsearch';

/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   city: 'Paris',
 *   claims:['sub','gender','family_name'] | null
 *   country: 'FR',
 *   event: 'FC_VERIFIED',
 *   idpLabel: 'Ameli';
 *   platform:'FranceConnect',
 *   interactionAcr: 'eidas1',
 *   spLabel: 'ANTS',
 *   time: '1647358722235', (millis)
 *   trackId: 'any-unique-track-index-identifier-string-from-ES',
 *   authenticationEventId: 'any-uuid-v4'
 * }
 */
export interface TracksOutputInterface extends TracksFormatterOutputAbstract {
  city?: string;
  country?: string;
  idpLabel?: string;
  platform: string;
  spLabel: string;
  claims: RichClaimInterface[];
  event: string;
  trackId: string;
  authenticationEventId: string;
  interactionAcr: string;
  time: number;
}
