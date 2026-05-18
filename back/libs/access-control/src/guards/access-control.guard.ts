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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.permissionHandler.handle(context);
  }
}
