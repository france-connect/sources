import type { RequireAtLeastOne } from 'type-fest';

import { EntityType, PermissionsType } from '../enums';

interface EntityOrPermissionOptionInterface {
  entityTypes?: EntityType[];
  permissionTypes?: PermissionsType[];
}

export type RelatedEntitiesHelperGetOptionsInterface =
  RequireAtLeastOne<EntityOrPermissionOptionInterface>;
