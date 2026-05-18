import type { UserInfosInterface } from '@fc/account';

import type { PermissionInterface } from './permission.interface';

export interface PartnersUserInfosInterface extends UserInfosInterface {
  permissions: PermissionInterface[];
}
