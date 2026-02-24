import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MatchType } from '../enums';
import {
  AccessControlDecoratorInterface,
  AccessControlOptionsInterface,
  AccessControlPermissionDataInterface,
} from '../interfaces';
import { ACCESS_CONTROL_METADATA_TOKEN } from '../tokens';

const defaultOptions: AccessControlOptionsInterface = {
  matchType: MatchType.ANY,
};

export function AccessControl<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
>(
  permissionData: Array<
    AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >
  >,
  options: AccessControlOptionsInterface = {},
) {
  return SetMetadata(ACCESS_CONTROL_METADATA_TOKEN, {
    permissionData,
    options: { ...defaultOptions, ...options },
  });
}

AccessControl.get = function get<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
>(
  reflector: Reflector,
  ctx: ExecutionContext,
): AccessControlDecoratorInterface<
  EntityType,
  PermissionType,
  PermissionHandlerType
> {
  const accessControlConfiguration = reflector.get<
    AccessControlDecoratorInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >
  >(ACCESS_CONTROL_METADATA_TOKEN, ctx.getHandler());
  return accessControlConfiguration;
};
