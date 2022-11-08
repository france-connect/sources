/* istanbul ignore file */

// Declarative file
import { EntityType, PermissionsType } from '../enums';

/**
 * @todo use a helper type like typefest
 * @see https://github.com/sindresorhus/type-fest
 */
type WithEntityOptionType = {
  entityTypes: EntityType[];
  permissionTypes?: PermissionsType[];
};

type WithPermissionOptionType = {
  entityTypes?: EntityType[];
  permissionTypes: PermissionsType[];
};

export type RelatedEntitiesHelperGetOptionsType =
  | WithEntityOptionType
  | WithPermissionOptionType;
