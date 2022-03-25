/* istanbul ignore file */

// Declarative code
/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   event: 'FC_VERIFIED',
 *   date: '2022-02-04T15:55:11.533Z',
 *   spName: 'ANTS',
 *   spAcr: 'eidas1',
 *   country: 'FR',
 *   city: 'Paris',
 *   platform:'FranceConnect',
 *   trackId: 'any-unique-track-index-identifier-string-from-ES',
 *   claims:['sub', 'gender', 'family_name'] | null
 * }
 */
export interface ICsmrTracksOutputTrack {
  event: string;
  date: string;
  spName: string;
  spAcr: string;
  country: string;
  city: string;
  trackId: string;
  platform: string;
  claims: string[] | null;
}
