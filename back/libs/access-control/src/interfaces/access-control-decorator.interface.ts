import { MatchType } from '../enums';
import { EntityIdLocationInterface } from './entity-id-location.interface';

export interface AccessControlHandlerInterface<
  EntityType extends string,
  PermissionHandlerType extends string,
> {
  readonly method: PermissionHandlerType;
  readonly entity?: EntityType;
  readonly column?: string;
}

export interface AccessControlPermissionDataInterface<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
> {
  readonly permission: PermissionType;
  readonly entity?: EntityType;
  readonly entityIdLocation?: EntityIdLocationInterface;
  readonly handler: AccessControlHandlerInterface<
    EntityType,
    PermissionHandlerType
  >;
}

export interface AccessControlOptionsInterface {
  readonly matchType?: MatchType;
}

export interface AccessControlDecoratorInterface<
  EntityType extends string,
  PermissionType extends string,
  PermissionHandlerType extends string,
> {
  readonly permissionData: Array<
    AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      PermissionHandlerType
    >
  >;
  readonly options: AccessControlOptionsInterface;
}
