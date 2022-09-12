/* istanbul ignore file */

import { ICsmrTracksHighFieldsData } from '../interfaces';

// Declarative code

/**
 * the time parameter is exclude for a specific process.
 */
export const FIELDS_FCP_HIGH: Array<keyof ICsmrTracksHighFieldsData> = [
  'idpName',
  'idpId',
  'event',
  'ip',
  'idpSub',
  'service',
  'spSub',
  'spId',
  'spName',
  'idpAcr',
  'idpLabel',
  'spAcr',
  'claims',
];
