import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  BasePermissionsHandlerService,
  EntityType,
  IPermission,
  PermissionsType,
  UnknownPermissionException,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger-legacy';

@Injectable()
export class AppPermissionsHandler extends BasePermissionsHandlerService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly reflector: Reflector,
  ) {
    super(logger, reflector);
    this.logger.setContext(this.constructor.name);
  }

  protected checkPermissions(
    permissionName: PermissionsType,
    context: ExecutionContext,
  ): boolean {
    switch (permissionName) {
      case PermissionsType.SERVICE_PROVIDER_LIST:
        return this.checkServiceProviderList(context);
      case PermissionsType.SERVICE_PROVIDER_EDIT:
        return this.checkServiceProviderId(
          context,
          PermissionsType.SERVICE_PROVIDER_EDIT,
        );
      case PermissionsType.SERVICE_PROVIDER_VIEW:
        return this.checkServiceProviderId(
          context,
          PermissionsType.SERVICE_PROVIDER_VIEW,
        );
      default:
        throw new UnknownPermissionException();
    }
  }

  private checkServiceProviderId(
    context: ExecutionContext,
    permissionType: PermissionsType,
  ) {
    const { params, userPermissions } = this.extractContextInfos(context);
    const { id: entityId } = params;

    const permission: IPermission = {
      permissionType,
      entity: EntityType.SERVICE_PROVIDER,
      entityId,
    };

    return this.standardMatchPermission(userPermissions, permission);
  }

  private checkServiceProviderList(context: ExecutionContext) {
    const { userPermissions } = this.extractContextInfos(context);

    const permission: IPermission = {
      permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
      entity: null,
      entityId: null,
    };

    return this.standardMatchPermission(userPermissions, permission);
  }
}
