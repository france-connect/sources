import { Observable, of } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

import { BasePermissionsHandlerService } from '../services';
import { APP_ACCESS_CONTROL_HANDLER } from '../tokens';

@Injectable()
export class AccessControlGuard<
  EntityType extends string,
  PermissionType extends string,
> implements CanActivate {
  constructor(
    @Inject(APP_ACCESS_CONTROL_HANDLER)
    private readonly permissionHandler: BasePermissionsHandlerService<
      EntityType,
      PermissionType
    >,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(this.permissionHandler.checkAllPermissions(context));
  }
}
