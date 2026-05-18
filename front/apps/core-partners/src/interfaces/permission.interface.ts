import type { AccessControlEntity, AccessControlPermission } from '../enums';

export interface PermissionInterface {
  entityId: string | null;
  entity: AccessControlEntity | null;
  permissionType: AccessControlPermission;
}
