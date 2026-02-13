import { NO_ENTITY_ID } from '@entities/typeorm';

import { uuid } from '@fc/common';

import {
  PermissionInterface,
  RelatedEntitiesHelperGetOptionsInterface,
} from '../interfaces';

export class RelatedEntitiesHelper {
  static get<EntityType, PermissionType>(
    permissions: PermissionInterface<EntityType, PermissionType>[],
    options: RelatedEntitiesHelperGetOptionsInterface,
  ): uuid[] {
    const ids = permissions
      .filter(RelatedEntitiesHelper.permissionFilter(options))
      .map(({ entityId }) => entityId)
      .filter((id) => id !== NO_ENTITY_ID);

    return ids;
  }

  static permissionFilter<EntityType, PermissionType>(
    options: RelatedEntitiesHelperGetOptionsInterface,
  ): (permission: PermissionInterface<EntityType, PermissionType>) => boolean {
    const { entityTypes, permissionTypes } = options;

    return (
      permission: PermissionInterface<EntityType, PermissionType>,
    ): boolean => {
      const matchEntity = RelatedEntitiesHelper.matchesOptions(
        permission.entity as string,
        entityTypes,
      );
      const matchPermission = RelatedEntitiesHelper.matchesOptions(
        permission.permissionType as string,
        permissionTypes,
      );

      return matchEntity && matchPermission;
    };
  }

  static matchesOptions<EntityType, PermissionType>(
    option: EntityType | PermissionType,
    optionsValue: string[],
  ): boolean {
    if (!optionsValue) {
      return true;
    }

    return optionsValue.includes(option as string);
  }
}
