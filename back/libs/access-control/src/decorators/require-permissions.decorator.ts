import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionsType } from '../enums';
import { PERMISSION_METADATA_TOKEN } from '../tokens';

export const RequirePermission = (
  ...args: (PermissionsType | PermissionsType[])[]
) => SetMetadata(PERMISSION_METADATA_TOKEN, args.flat().filter(Boolean));

RequirePermission.get = function (
  reflector: Reflector,
  ctx: ExecutionContext,
): PermissionsType[] {
  const value = reflector.get<PermissionsType[]>(
    PERMISSION_METADATA_TOKEN,
    ctx.getHandler(),
  );

  return value || [];
};
