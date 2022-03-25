/* istanbul ignore file */

// Declarative code
import { IFormattedIdpSettings } from './formatted-idp-settings.interface';

/**
 * This format is used by csmr-user-preferences controllers
 *
 * @example [{
 *   uid: 'idp_uid',
 *   name: 'idp',
 *   image: 'idp.png'
 *   title: 'IDP',
 *   active: true,
 *   isChecked: true
 * },
 * {
 *   uid: 'idp2_uid',
 *   name: 'idp2',
 *   image: 'idp2.png'
 *   title: 'IDP2',
 *   active: true,
 *   isChecked: false
 * }]
 */
export type IFormattedIdpSettingsResponse = IFormattedIdpSettings | 'ERROR';
