import { Injectable } from '@nestjs/common';

import {
  AccessControlPermissionDataInterface,
  BaseAccessControlHandler,
  PermissionInterface,
} from '@fc/access-control';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
} from '../enums';

@Injectable()
export class AppPermissionsHandler extends BaseAccessControlHandler<
  AccessControlEntity,
  AccessControlPermission,
  AccessControlHandler
> {
  private [AccessControlHandler.DIRECT_ENTITY](
    permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    >,
    entityId: string,
    userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission &&
        userPermission.entity === permission.entity &&
        userPermission.entityId === entityId,
    );
  }

  private [AccessControlHandler.GLOBAL_PERMISSION](
    permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    >,
    _entityId: string,
    userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission,
    );
  }
}
