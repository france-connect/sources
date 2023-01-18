/* istanbul ignore file */

// Declarative file
import type { RequireAtLeastOne } from 'type-fest';

import { EntityType, PermissionsType } from '../enums';

/**
 * @todo use a helper type like typefest
 * @see https://github.com/sindresorhus/type-fest
 */
interface EntityOrPermissionOptionInterface {
  entityTypes?: EntityType[];
  permissionTypes?: PermissionsType[];
}

export type RelatedEntitiesHelperGetOptionsType =
  RequireAtLeastOne<EntityOrPermissionOptionInterface>;
