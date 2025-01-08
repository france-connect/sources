import { uuid } from '@fc/common';

import { PermissionInterface } from './permission.interface';

export interface PermissionsRequestInformationsInterface {
  readonly userPermissions: PermissionInterface[];
  readonly entityId: uuid | null;
}
