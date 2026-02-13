import { uuid } from '@fc/common';

export interface PermissionInterface<EntityType, PermissionType> {
  readonly entityId: uuid | null;
  readonly entity: EntityType | null;
  readonly permissionType: PermissionType;
}
