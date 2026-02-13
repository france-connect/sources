import { uuid } from '@fc/common';

import { PermissionInterface } from './permission.interface';

export interface PermissionsRequestInformationsInterface<
  EntityType extends string,
  PermissionType extends string,
> {
  readonly userPermissions: PermissionInterface<EntityType, PermissionType>[];
  readonly entityId: uuid | null;
}
