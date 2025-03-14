import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';

export interface AddPermissionInterface {
  accountId: uuid;
  permissionType: PermissionsType;
  entity: EntityType;
  entityId?: uuid;
}
