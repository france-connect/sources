import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { AccessControl } from '../decorators';
import { AccessControlAccountSession } from '../dto';
import { MatchType } from '../enums';
import { AccessControlUnknownHandlerException } from '../exceptions';
import {
  AccessControlDecoratorInterface,
  AccessControlOptionsInterface,
  AccessControlPermissionDataInterface,
  EntityIdLocationInterface,
  PermissionsRequestInformationsInterface,
  RequestInformationsInterface,
} from '../interfaces';

@Injectable()
export abstract class BaseAccessControlHandler<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
> {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly sessionService: SessionService,
    protected readonly logger: LoggerService,
  ) {}

  public handle(context: ExecutionContext): boolean {
    const controllerPermissions = AccessControl.get<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >(this.reflector, context);

    if (
      !controllerPermissions ||
      controllerPermissions.permissionData.length === 0
    ) {
      return false;
    }

    return this.checkPermissions(controllerPermissions, context);
  }

  protected checkPermissions(
    {
      permissionData,
      options,
    }: AccessControlDecoratorInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    context: ExecutionContext,
  ): boolean {
    if (options.matchType === MatchType.ALL) {
      return this.matchAllPermissions(permissionData, options, context);
    }

    return this.matchAnyPermission(permissionData, options, context);
  }

  protected extractContextInfo(
    context: ExecutionContext,
    entityIdLocation?: EntityIdLocationInterface,
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

  protected matchAllPermissions(
    permissionData: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >[],
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ): boolean {
    return permissionData.every((permission) =>
      this.checkOnePermission(permission, options, context),
    );
  }

  protected matchAnyPermission(
    permissionData: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >[],
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ) {
    return permissionData.some((permission) =>
      this.checkOnePermission(permission, options, context),
    );
  }

  protected checkOnePermission(
    permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ) {
    const { entityId, userPermissions } = this.extractContextInfo(
      context,
      permission.entityIdLocation,
    );

    const handler = permission.handler.method;

    if (typeof (this as any)[handler] !== 'function') {
      throw new AccessControlUnknownHandlerException(handler);
    }

    const result = (this as any)[handler](
      permission,
      entityId,
      userPermissions,
      options,
    );

    return result;
  }
}
