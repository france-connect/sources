/* istanbul ignore file */

// Declarative code
import { IIdpSettings } from './user-preferences-fcp-idp-settings.interface';

/**
 * This format is used by user-preferences-fcp controllers
 *
 * @example {
 *   updatedAt: ISODate("2020....."),
 *   includeList: ['idp_id_x', 'idp_id_y']
 * }
 */
export type IIdpSettingsResponse = IIdpSettings | 'ERROR';
