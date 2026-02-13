import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  BasePermissionsHandlerService,
  PermissionInterface,
  RequirePermissionDecoratorInterface,
  UnknownPermissionException,
} from '@fc/access-control';
import { SessionService } from '@fc/session';

import { AccessControlEntity, AccessControlPermission } from '../enums';

@Injectable()
export class AppPermissionsHandler extends BasePermissionsHandlerService<
  AccessControlEntity,
  AccessControlPermission
> {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly sessionService: SessionService,
  ) {
    super(reflector, sessionService);
  }

  /**
   * The role of the fonction is to map the given permission to the right handler.
   * That does not impact readability.
   */
  protected checkPermissions(
    {
      entity,
      permissionType,
      entityIdLocation,
    }: RequirePermissionDecoratorInterface<
      AccessControlEntity,
      AccessControlPermission
    >,
    context: ExecutionContext,
  ): boolean {
    if (
      !Object.values(AccessControlPermission).includes(
        permissionType as AccessControlPermission,
      )
    ) {
      throw new UnknownPermissionException();
    }

    const { entityId, userPermissions } = this.extractContextInfo(
      context,
      entityIdLocation,
    );

    const permission: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    > = {
      permissionType,
      entity,
      entityId,
    };

    return this.standardMatchPermission(userPermissions, permission);
  }
}
