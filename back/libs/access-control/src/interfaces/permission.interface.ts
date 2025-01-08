import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';

export interface PermissionInterface {
  readonly entityId: uuid | null;
  readonly entity: EntityType | null;
  readonly permissionType: PermissionsType;
}
