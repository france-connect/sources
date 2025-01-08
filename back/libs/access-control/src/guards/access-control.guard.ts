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
export class AccessControlGuard implements CanActivate {
  constructor(
    @Inject(APP_ACCESS_CONTROL_HANDLER)
    private readonly permissionHandler: BasePermissionsHandlerService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    return of(this.permissionHandler.checkAllPermissions(context));
  }
}
