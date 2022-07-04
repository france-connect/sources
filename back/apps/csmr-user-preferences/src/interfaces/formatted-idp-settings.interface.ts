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

export interface ISetIdpSettingsPayload {
  formattedIdpSettingsList: IFormattedIdpList[];
  updatedIdpSettingsList: IFormattedIdpList[];
  hasAllowFutureIdpChanged: boolean;
  updatedAt: Date;
}

export interface IFormattedUserIdpSettingsLists {
  formattedIdpSettingsList: IFormattedIdpList[];
  formattedPreviousIdpSettingsList: IFormattedIdpList[];
}

export interface IFormattedIdpSettingsPayload {
  idpList: IFormattedIdpList[];
  updatedIdpSettingsList: IFormattedIdpList[];
  hasAllowFutureIdpChanged: boolean;
  allowFutureIdp: boolean;
  updatedAt: Date;
}
