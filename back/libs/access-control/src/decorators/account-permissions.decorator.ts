import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IPermission } from '../interfaces';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

export const AccountPermissionsDecorator = (
  _target: unknown,
  ctx: ExecutionContext,
): IPermission[] => {
  const request = ctx.switchToHttp().getRequest();

  return request[ACCESS_CONTROL_TOKEN];
};

export const AccountPermissions = createParamDecorator(
  AccountPermissionsDecorator,
);
