import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';
import {
  PermissionInterface,
  RelatedEntitiesHelperGetOptionsInterface,
} from '../interfaces';

export class RelatedEntitiesHelper {
  static get(
    permissions: PermissionInterface[],
    options: RelatedEntitiesHelperGetOptionsInterface,
  ): uuid[] {
    const ids = permissions
      .filter(RelatedEntitiesHelper.permissionFilter(options))
      .map(({ entityId }) => entityId)
      .filter((id) => id !== null);

    return ids;
  }

  static permissionFilter(
    options: RelatedEntitiesHelperGetOptionsInterface,
  ): (permission: PermissionInterface) => boolean {
    const { entityTypes, permissionTypes } = options;

    return (permission: PermissionInterface): boolean => {
      const matchEntity = RelatedEntitiesHelper.matchesOptions(
        permission.entity,
        entityTypes,
      );
      const matchPermission = RelatedEntitiesHelper.matchesOptions(
        permission.permissionType,
        permissionTypes,
      );

      return matchEntity && matchPermission;
    };
  }

  static matchesOptions(
    option: PermissionsType | EntityType,
    optionsValue: string[],
  ): boolean {
    if (!optionsValue) {
      return true;
    }

    return optionsValue.includes(option);
  }
}
