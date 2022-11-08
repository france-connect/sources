/* istanbul ignore file */

// Declarative code
import { Repository } from 'typeorm';

import { DynamicModule, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountPermission } from '@entities/typeorm';

import { AccessControlGuard } from './guards';
import { AccessControlSessionMiddleware } from './middlewares';
import {
  AccountPermissionRepository,
  BasePermissionsHandlerService,
} from './services';
import { APP_ACCESS_CONTROL_HANDLER } from './tokens';

@Module({})
export class AccessControlModule {
  static withRolesHandler(
    handler: Type<BasePermissionsHandlerService>,
  ): DynamicModule {
    const accountRole = TypeOrmModule.forFeature([AccountPermission]);
    const guard = [
      AccessControlGuard,
      { provide: APP_ACCESS_CONTROL_HANDLER, useClass: handler },
    ];
    return {
      module: AccessControlModule,
      imports: [accountRole],
      exports: [
        AccountPermissionRepository,
        AccessControlSessionMiddleware,
        AccessControlGuard,
        accountRole,
        ...guard,
      ],
      providers: [
        AccountPermissionRepository,
        Repository<AccountPermission>,
        AccessControlSessionMiddleware,
        ...guard,
      ],
    };
  }
}
