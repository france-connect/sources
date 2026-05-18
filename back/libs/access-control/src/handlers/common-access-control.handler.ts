import { In } from 'typeorm';

import { Inject, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { CommonAccessControlHandlerEnum } from '../enums';
import { RelatedEntitiesHelper } from '../helpers';
import {
  AccessControlPermissionDataInterface,
  PermissionInterface,
} from '../interfaces';
import { ENTITIES_MAP_TOKEN } from '../tokens';
import { BaseAccessControlHandler } from './base-access-control-handler.handler';

@Injectable()
export abstract class CommonAccessControlHandler<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
> extends BaseAccessControlHandler<
  EntityType,
  PermissionType,
  PermissionHandlerType
> {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly reflector: Reflector,
    protected readonly sessionService: SessionService,
    protected readonly logger: LoggerService,
    protected readonly typeorm: TypeormService,
    @Inject(ENTITIES_MAP_TOKEN)
    protected readonly entitiesMap: Record<string, Type<any>>,
  ) {
    super(reflector, sessionService, logger, typeorm);
  }

  protected [CommonAccessControlHandlerEnum.DIRECT_ENTITY](
    permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    entityId: string,
    userPermissions: PermissionInterface<EntityType, PermissionType>[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission &&
        userPermission.entity === permission.entity &&
        userPermission.entityId === entityId,
    );
  }

  protected async [CommonAccessControlHandlerEnum.RELATED_ENTITY](
    permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    entityId: string,
    userPermissions: PermissionInterface<EntityType, PermissionType>[],
  ): Promise<boolean> {
    const relatedIds = RelatedEntitiesHelper.get(userPermissions, {
      entityTypes: [permission.handler.entity as keyof typeof this.entitiesMap],
    });

    const repository = this.typeorm.getRepository(
      this.entitiesMap[permission.entity as keyof typeof this.entitiesMap],
    );

    const found = await repository.findOne({
      where: {
        id: entityId,
        [permission.handler.column]: In(relatedIds),
      },
    });

    return Boolean(found);
  }

  protected [CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
    permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
    _entityId: string,
    userPermissions: PermissionInterface<EntityType, PermissionType>[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission &&
        userPermission.entityId === NO_ENTITY_ID &&
        userPermission.entity === null,
    );
  }
}
