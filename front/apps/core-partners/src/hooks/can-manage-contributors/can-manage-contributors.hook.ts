import { useParams } from 'react-router';

import { useAccountContext } from '@fc/account';

import { AccessControlEntity, AccessControlPermission } from '../../enums';
import type { PartnersUserInfosInterface } from '../../interfaces';

// @NOTE mirrors the back access control applied to both the contributor
// creation and the contributor deletion routes
export const useCanManageContributors = () => {
  const { serviceProviderId } = useParams<{ serviceProviderId: string }>();
  const { userinfos } = useAccountContext<PartnersUserInfosInterface>();

  const canManageContributors =
    userinfos?.permissions.some(
      (p) =>
        p.entity === AccessControlEntity.SERVICE_PROVIDER &&
        p.entityId === serviceProviderId &&
        (p.permissionType === AccessControlPermission.SP_ADMIN ||
          p.permissionType === AccessControlPermission.SP_TECH),
    ) ?? false;

  return canManageContributors;
};
