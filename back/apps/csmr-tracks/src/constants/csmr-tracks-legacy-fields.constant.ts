/* istanbul ignore file */

// Declarative code

import { ICsmrTracksLegacyFieldsData } from '../interfaces';

/**
 * the time parameter is exclude for a specific process.
 */
export const FIELDS_FC_LEGACY: Array<keyof ICsmrTracksLegacyFieldsData> = [
  'name',
  'fiId',
  'fiSub',
  'fsId',
  'fsSub',
  'scopes',
  'userIp',
  'action',
  'type_action',
  'fi',
  'fs_label',
  'eidas',
];
