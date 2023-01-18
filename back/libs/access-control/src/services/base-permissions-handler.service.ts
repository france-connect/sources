/* istanbul ignore file */

// Declarative code
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '@fc/logger-legacy';

import { RequirePermission } from '../decorators';
import { PermissionsType } from '../enums';
import {
  IPermission,
  PermissionsRequestInformations,
  RequestInformations,
} from '../interfaces';
import { ACCESS_CONTROL_TOKEN } from '../tokens';

export abstract class BasePermissionsHandlerService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly reflector: Reflector,
  ) {}

  public checkAllPermissions(context: ExecutionContext): boolean {
    const controllerPermissions = RequirePermission.get(
      this.reflector,
      context,
    );

    if (controllerPermissions.length === 0) {
      return true;
    }

    return controllerPermissions.some((role) =>
      this.checkPermissions(role, context),
    );
  }

  protected abstract checkPermissions(
    roleName: PermissionsType,
    context: ExecutionContext,
  ): boolean;

  protected standardMatchPermission(
    userPermissions: IPermission[],
    controllerPermission: IPermission,
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === controllerPermission.permissionType &&
        userPermission.entity === controllerPermission.entity &&
        userPermission.entityId === controllerPermission.entityId,
    );
  }

  protected extractContextInfos(
    context: ExecutionContext,
  ): PermissionsRequestInformations {
    const request = context
      .switchToHttp()
      //@todo: Find a "Request" type that contains everything that we need
      //@todo: use a type, well matching
      .getRequest<RequestInformations>();

    const { body, params, query } = request;
    const userPermissions = request[ACCESS_CONTROL_TOKEN];

    return {
      body,
      params,
      query,
      userPermissions,
    };
  }
}
