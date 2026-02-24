import { Observable, of } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

import { BaseAccessControlHandler } from '../handlers';
import { APP_ACCESS_CONTROL_HANDLER } from '../tokens';

@Injectable()
export class AccessControlGuard<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
> implements CanActivate {
  constructor(
    @Inject(APP_ACCESS_CONTROL_HANDLER)
    private readonly permissionHandler: BaseAccessControlHandler<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(this.permissionHandler.handle(context));
  }
}
