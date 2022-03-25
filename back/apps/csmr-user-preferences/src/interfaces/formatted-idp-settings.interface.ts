/* istanbul ignore file */

import { IdentityProviderMetadata } from '@fc/oidc';

// Declarative code
/**
 * This format is the one used by the FC apps.
 *
 * @example {
 *   uid: 'idp_uid',
 *   name: 'idp',
 *   image: 'idp.png'
 *   title: 'IDP',
 *   active: true,
 *   isChecked: true
 * }
 */
export type IFormattedIdpList = Pick<
  IdentityProviderMetadata,
  'uid' | 'name' | 'image' | 'title' | 'active'
> & { isChecked: boolean };

export interface IFormattedIdpSettings {
  allowFutureIdp: boolean;
  idpList: IFormattedIdpList[];
}
