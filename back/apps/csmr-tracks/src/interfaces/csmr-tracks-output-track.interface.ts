/* istanbul ignore file */

// Declarative code
/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   event: 'connexion',
 *   date: new Date('2020-03-09'),
 *   accountId: "abcdefghij123456789",
 *   spId: uuid(),
 *   spName: 'ANTS',
 *   spAcr: 'eidas1',
 *   country: 'FR',
 *   city: 'Paris',
 *   trackId: 'any-unique-track-index-identifier-string-from-ES',
 * }
 */
export interface ICsmrTracksOutputTrack {
  event: string;
  date: string;
  accountId: string;
  spId: string;
  spName: string;
  spAcr: string;
  country: string;
  city: string;
  trackId: string;
}
