import { TracksFormatterOutputAbstract } from '@fc/tracks-adapter-elasticsearch';

/**
 * @example {
 *   city: 'Paris',
 *   country: 'FR',
 *   idpName: 'Ameli';
 *   platform:'FC (v1)',
 *   spName: 'ANTS',
 *   date: '08/03/1995 12:00:00',
 *   accountId: 'any-string'
 *   idpSub: 'any-string'
 *   spSub: 'any-string'
 *   interactionAcr: 'eidas1'
 *   ipAddress: ['ipAddress']
 * -}
 */
export interface TracksFormatterOutputInterface
  extends TracksFormatterOutputAbstract {
  city?: string;
  country?: string;
  idpName?: string;
  platform: string;
  spName: string;
  accountId: string;
  date: string;
  idpSub: string;
  spSub: string;
  interactionAcr: string;
  ipAddress: string[];
}
