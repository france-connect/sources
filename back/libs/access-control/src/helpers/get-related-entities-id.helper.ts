import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';
import {
  IPermission,
  RelatedEntitiesHelperGetOptionsType,
} from '../interfaces';

export class RelatedEntitiesHelper {
  static get(
    permissions: IPermission[],
    options: RelatedEntitiesHelperGetOptionsType,
  ): uuid[] {
    const ids = permissions
      .filter(RelatedEntitiesHelper.permissionFilter(options))
      .map(({ entityId }) => entityId);

    return ids;
  }

  static permissionFilter(
    options: RelatedEntitiesHelperGetOptionsType,
  ): (permission: IPermission) => boolean {
    const { entityTypes, permissionTypes } = options;

    return (permission: IPermission): boolean => {
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
