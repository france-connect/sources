import { isUUID } from 'class-validator';

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { ArrayAsyncHelper, uuid } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { AccessControl } from '../decorators';
import { AccessControlAccountSession } from '../dto';
import { MatchType } from '../enums';
import {
  AccessControlInvalidEntityIdException,
  AccessControlUnknownHandlerException,
} from '../exceptions';
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
    protected readonly typeorm: TypeormService,
  ) {}

  public async handle(context: ExecutionContext): Promise<boolean> {
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

    return await this.checkPermissions(controllerPermissions, context);
  }

  protected async checkPermissions(
    {
      permissionData,
      options,
    }: AccessControlDecoratorInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    context: ExecutionContext,
  ): Promise<boolean> {
    if (options.matchType === MatchType.ALL) {
      return await this.matchAllPermissions(permissionData, options, context);
    }

    return await this.matchAnyPermission(permissionData, options, context);
  }

  protected extractContextInfo(
    context: ExecutionContext,
    entityIdLocation?: EntityIdLocationInterface,
  ): PermissionsRequestInformationsInterface<EntityType, PermissionType> {
    const request = this.getRequest(context);
    const userPermissions = this.getUserPermissions();
    const entityId = this.getEntityId(request, entityIdLocation);

    this.validateEntityId(entityId);

    return {
      entityId,
      userPermissions,
    };
  }

  private getRequest(context: ExecutionContext): RequestInformationsInterface {
    return context.switchToHttp().getRequest<RequestInformationsInterface>();
  }

  private getUserPermissions(): PermissionsRequestInformationsInterface<
    EntityType,
    PermissionType
  >['userPermissions'] {
    const sessionData =
      this.sessionService.get<
        AccessControlAccountSession<EntityType, PermissionType>
      >('PartnersAccount');

    if (!sessionData) {
      throw new SessionNotFoundException('PartnersAccount');
    }

    return sessionData.permissions;
  }

  private getEntityId(
    request: RequestInformationsInterface,
    entityIdLocation?: EntityIdLocationInterface,
  ): uuid {
    if (!entityIdLocation) {
      return NO_ENTITY_ID;
    }

    return request[entityIdLocation.src]?.[entityIdLocation.key];
  }

  private validateEntityId(entityId: uuid): void {
    /**
     * Validate that the entityId is a valid UUIDv4 when it is not the default NO_ENTITY_ID value.
     * Guards are executed before Validation Pipes, so we must validate the format here.
     */
    if (entityId !== NO_ENTITY_ID && !isUUID(entityId, '4')) {
      throw new AccessControlInvalidEntityIdException();
    }
  }

  protected async matchAllPermissions(
    permissionData: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >[],
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ): Promise<boolean> {
    return await ArrayAsyncHelper.everyAsync(
      permissionData,
      async (permission) =>
        await this.checkOnePermission(permission, options, context),
    );
  }

  protected async matchAnyPermission(
    permissionData: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >[],
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ): Promise<boolean> {
    return await ArrayAsyncHelper.someAsync(
      permissionData,
      async (permission) =>
        await this.checkOnePermission(permission, options, context),
    );
  }

  protected async checkOnePermission(
    permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    options: AccessControlOptionsInterface,
    context: ExecutionContext,
  ): Promise<boolean> {
    const { entityId, userPermissions } = this.extractContextInfo(
      context,
      permission.entityIdLocation,
    );

    /**
     * `unknown` cast is used because:
     * Method must be implemented in the implementing class,
     * Typescript can't infer the method name, because in this class the method name is represented by a generic type
     */
    const handler = (this as unknown as Record<string, unknown>)[
      permission.handler.method
    ];

    if (typeof handler !== 'function') {
      throw new AccessControlUnknownHandlerException(permission.handler.method);
    }

    const result = await handler.bind(this)(
      permission,
      entityId,
      userPermissions,
      context,
      options,
    );

    return result;
  }
}
