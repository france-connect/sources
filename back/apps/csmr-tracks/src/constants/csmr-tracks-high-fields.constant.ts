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
  'spSub',
  'spId',
  'idpAcr',
  'idpLabel',
  'spAcr',
  'claims',
];
