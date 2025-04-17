import { TracksFormatterOutputAbstract } from '@fc/tracks-adapter-elasticsearch';

/**
 * @example {
 *   city: 'Paris',
 *   country: 'FR',
 *   idpName: 'Ameli';
 *   idpId: 'any-id';
 *   platform:'FC (v1)',
 *   spName: 'ANTS',
 *   spId: 'any-id';
 *   time: 1664661600000,
 *   accountId: 'any-string'
 *   idpSub: 'any-string'
 *   spSub: 'any-string'
 *   interactionAcr: 'eidas1'
 *   interactionId: 'any-id';
 *   browsingSessionId: 'any-id';
 *   ipAddress: ['ipAddress']
 * -}
 */
export interface TracksFormatterOutputInterface
  extends TracksFormatterOutputAbstract {
  time: number;
  accountId: string;
  spName: string;
  idpName?: string;
  spId: string;
  idpId: string;
  spSub: string;
  idpSub: string;
  platform: string;
  interactionAcr: string;
  interactionId: string;
  browsingSessionId: string;
  city?: string;
  country?: string;
  ipAddress: string[];
}
