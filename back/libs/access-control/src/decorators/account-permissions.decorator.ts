import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { PermissionInterface } from '../interfaces';
import { AccountPermissionService } from '../services';

export const AccountPermissionsDecorator = (
  _target: unknown,
  _ctx: ExecutionContext,
): PermissionInterface[] => {
  const accountPermissionsService =
    NestJsDependencyInjectionWrapper.get<AccountPermissionService>(
      AccountPermissionService,
    );

  const accountPermissions =
    accountPermissionsService.getPermissionsFromSession();

  return accountPermissions;
};

export const AccountPermissions = createParamDecorator(
  AccountPermissionsDecorator,
);
