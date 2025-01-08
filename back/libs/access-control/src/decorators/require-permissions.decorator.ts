import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequirePermissionDecoratorInterface } from '../interfaces';
import { PERMISSION_METADATA_TOKEN } from '../tokens';

export const RequirePermission = (
  permissionData: RequirePermissionDecoratorInterface,
) => SetMetadata(PERMISSION_METADATA_TOKEN, permissionData);

RequirePermission.get = function (
  reflector: Reflector,
  ctx: ExecutionContext,
): RequirePermissionDecoratorInterface | null {
  const value = reflector.get<RequirePermissionDecoratorInterface>(
    PERMISSION_METADATA_TOKEN,
    ctx.getHandler(),
  );

  return value || null;
};
