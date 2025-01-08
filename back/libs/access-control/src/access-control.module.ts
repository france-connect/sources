import { Repository } from 'typeorm';

import { DynamicModule, Module, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { AccessControlGuard } from './guards';
import { AccessControlSessionInterceptor } from './interceptors/access-control-session.interceptor';
import {
  AccountPermissionRepository,
  AccountPermissionService,
  BasePermissionsHandlerService,
} from './services';
import { APP_ACCESS_CONTROL_HANDLER } from './tokens';

@Module({})
export class AccessControlModule {
  static withRolesHandler(
    handler: Type<BasePermissionsHandlerService>,
  ): DynamicModule {
    const accountRole = TypeOrmModule.forFeature([PartnersAccountPermission]);

    return {
      module: AccessControlModule,
      imports: [accountRole],
      exports: [
        { provide: APP_ACCESS_CONTROL_HANDLER, useClass: handler },
        AccessControlGuard,
        AccountPermissionRepository,
        accountRole,
        AccountPermissionService,
      ],
      providers: [
        { provide: APP_ACCESS_CONTROL_HANDLER, useClass: handler },
        AccessControlGuard,
        Repository<PartnersAccountPermission>,
        AccountPermissionRepository,
        AccountPermissionService,
        {
          provide: APP_INTERCEPTOR,
          useClass: AccessControlSessionInterceptor,
        },
      ],
    };
  }
}
