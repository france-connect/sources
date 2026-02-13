import type { RequireAtLeastOne } from 'type-fest';

interface EntityOrPermissionOptionInterface {
  entityTypes?: string[];
  permissionTypes?: string[];
}

export type RelatedEntitiesHelperGetOptionsInterface =
  RequireAtLeastOne<EntityOrPermissionOptionInterface>;
