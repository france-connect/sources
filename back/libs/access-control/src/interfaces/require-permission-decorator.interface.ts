import { EntityType, PermissionsType } from '../enums';

export interface EntityIdInterface {
  readonly src: 'body' | 'params' | 'query';
  readonly key: string;
}
export interface RequirePermissionDecoratorInterface {
  readonly permissionType: PermissionsType;
  readonly entity: EntityType;
  readonly entityIdLocation?: EntityIdInterface | null;
}
