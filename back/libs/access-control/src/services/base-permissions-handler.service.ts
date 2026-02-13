import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { RequirePermission } from '../decorators';
import { AccessControlAccountSession } from '../dto';
import {
  EntityIdInterface,
  PermissionInterface,
  PermissionsRequestInformationsInterface,
  RequestInformationsInterface,
  RequirePermissionDecoratorInterface,
} from '../interfaces';

@Injectable()
export abstract class BasePermissionsHandlerService<
  EntityType extends string,
  PermissionType extends string,
> {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly sessionService: SessionService,
  ) {}

  public checkAllPermissions(context: ExecutionContext): boolean {
    const controllerPermissions = RequirePermission.get<
      EntityType,
      PermissionType
    >(this.reflector, context);

    if (!controllerPermissions) {
      return true;
    }

    return this.checkPermissions(controllerPermissions, context);
  }

  protected abstract checkPermissions(
    roleName: RequirePermissionDecoratorInterface<EntityType, PermissionType>,
    context: ExecutionContext,
  ): boolean;

  protected standardMatchPermission(
    userPermissions: PermissionInterface<EntityType, PermissionType>[],
    controllerPermission: PermissionInterface<EntityType, PermissionType>,
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
  ): PermissionsRequestInformationsInterface<EntityType, PermissionType> {
    const request = context
      .switchToHttp()
      .getRequest<RequestInformationsInterface>();

    const sessionData =
      this.sessionService.get<
        AccessControlAccountSession<EntityType, PermissionType>
      >('PartnersAccount');

    if (!sessionData) {
      throw new SessionNotFoundException('PartnersAccount');
    }

    const { permissions: userPermissions } = sessionData;

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
