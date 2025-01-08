import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  BasePermissionsHandlerService,
  PermissionInterface,
  PermissionsType,
  RequirePermissionDecoratorInterface,
  UnknownPermissionException,
} from '@fc/access-control';
import { SessionService } from '@fc/session';

@Injectable()
export class AppPermissionsHandler extends BasePermissionsHandlerService {
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
    }: RequirePermissionDecoratorInterface,
    context: ExecutionContext,
  ): boolean {
    if (!Object.values(PermissionsType).includes(permissionType)) {
      throw new UnknownPermissionException();
    }

    const { entityId, userPermissions } = this.extractContextInfo(
      context,
      entityIdLocation,
    );

    const permission: PermissionInterface = {
      permissionType,
      entity,
      entityId,
    };

    return this.standardMatchPermission(userPermissions, permission);
  }
}
