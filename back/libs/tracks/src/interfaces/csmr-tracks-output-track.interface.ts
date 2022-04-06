/* istanbul ignore file */

// Declarative code
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
 *   spName: 'ANTS',
 *   time: '1647358722235', (millis)
 *   trackId: 'any-unique-track-index-identifier-string-from-ES',
 * }
 */
export interface ICsmrTracksOutputTrack {
  city: string;
  claims: string[] | null;
  country: string;
  event: string;
  idpName: string;
  platform: string;
  spAcr: string;
  spName: string;
  time: number;
  trackId: string;
}
