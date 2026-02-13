import { uuid } from '@fc/common';

export interface AddPermissionInterface<
  EntityType extends string,
  PermissionType extends string,
> {
  accountId: uuid;
  permissionType: PermissionType;
  entity: EntityType;
  entityId?: uuid;
}
