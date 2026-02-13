import { PermissionInterface } from './permission.interface';

export interface AccessControlSession<
  EntityType extends string,
  PermissionType extends string,
> {
  permissions: PermissionInterface<EntityType, PermissionType>[];
}
