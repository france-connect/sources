import { uuid } from '@fc/common';

export interface PermissionInterface<EntityType, PermissionType> {
  readonly entityId?: uuid;
  readonly entity?: EntityType | null;
  readonly permissionType: PermissionType;
}
