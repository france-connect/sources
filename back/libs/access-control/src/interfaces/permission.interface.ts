/* istanbul ignore file */

// Declarative code
import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';

export interface IPermission {
  readonly entityId: uuid | null;
  readonly entity: EntityType | null;
  readonly permissionType: PermissionsType;
}
