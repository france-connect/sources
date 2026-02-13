export interface EntityIdInterface {
  readonly src: 'body' | 'params' | 'query';
  readonly key: string;
}
export interface RequirePermissionDecoratorInterface<
  EntityType extends string,
  PermissionType extends string,
> {
  readonly permissionType: PermissionType;
  readonly entity: EntityType;
  readonly entityIdLocation?: EntityIdInterface | null;
}
