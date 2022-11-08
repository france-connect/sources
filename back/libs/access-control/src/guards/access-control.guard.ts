import { Observable, of } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';

import { BasePermissionsHandlerService } from '../services';
import { APP_ACCESS_CONTROL_HANDLER } from '../tokens';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    @Inject(APP_ACCESS_CONTROL_HANDLER)
    private readonly permissionHandler: BasePermissionsHandlerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    this.logger.debug(context);

    return of(this.permissionHandler.checkAllPermissions(context));
  }
}
