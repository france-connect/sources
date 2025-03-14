import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { RequirePermission } from '../decorators';
import {
  EntityIdInterface,
  PermissionInterface,
  PermissionsRequestInformationsInterface,
  RequestInformationsInterface,
  RequirePermissionDecoratorInterface,
} from '../interfaces';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

@Injectable()
export abstract class BasePermissionsHandlerService {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly sessionService: SessionService,
  ) {}

  public checkAllPermissions(context: ExecutionContext): boolean {
    const controllerPermissions = RequirePermission.get(
      this.reflector,
      context,
    );

    if (!controllerPermissions) {
      return true;
    }

    return this.checkPermissions(controllerPermissions, context);
  }

  protected abstract checkPermissions(
    roleName: RequirePermissionDecoratorInterface,
    context: ExecutionContext,
  ): boolean;

  protected standardMatchPermission(
    userPermissions: PermissionInterface[],
    controllerPermission: PermissionInterface,
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === controllerPermission.permissionType &&
        userPermission.entity === controllerPermission.entity &&
        userPermission.entityId === controllerPermission.entityId,
    );
  }

  protected extractContextInfo(
    context: ExecutionContext,
    entityIdLocation: EntityIdInterface | null,
  ): PermissionsRequestInformationsInterface {
    const request = context
      .switchToHttp()
      .getRequest<RequestInformationsInterface>();

    const sessionData =
      this.sessionService.get<PartnersAccountSession>('PartnersAccount');
    const { userPermissions } = sessionData[ACCESS_CONTROL_TOKEN];

    let entityId: uuid = NO_ENTITY_ID;

    if (entityIdLocation) {
      entityId = request[entityIdLocation.src]?.[entityIdLocation.key];
    }

    return {
      entityId,
      userPermissions,
    };
  }
}
