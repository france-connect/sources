import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequirePermissionDecoratorInterface } from '../interfaces';
import { PERMISSION_METADATA_TOKEN } from '../tokens';

export function RequirePermission<
  EntityType extends string,
  PermissionType extends string,
>(
  permissionData: RequirePermissionDecoratorInterface<
    EntityType,
    PermissionType
  >,
) {
  return SetMetadata(PERMISSION_METADATA_TOKEN, permissionData);
}

RequirePermission.get = function get<
  EntityType extends string,
  PermissionType extends string,
>(
  reflector: Reflector,
  ctx: ExecutionContext,
): RequirePermissionDecoratorInterface<EntityType, PermissionType> | null {
  const value = reflector.get<
    RequirePermissionDecoratorInterface<EntityType, PermissionType>
  >(PERMISSION_METADATA_TOKEN, ctx.getHandler());
  return value || null;
};
