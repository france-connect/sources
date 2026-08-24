import { useParams } from 'react-router';

import { useAccountContext } from '@fc/account';

import { AccessControlEntity, AccessControlPermission } from '../../enums';
import type { PartnersUserInfosInterface } from '../../interfaces';

export const useCanCreateContributor = () => {
  const { serviceProviderId } = useParams<{ serviceProviderId: string }>();
  const { userinfos } = useAccountContext<PartnersUserInfosInterface>();

  const canCreateContributor =
    userinfos?.permissions.some(
      (p) =>
        p.entity === AccessControlEntity.SERVICE_PROVIDER &&
        p.entityId === serviceProviderId &&
        (p.permissionType === AccessControlPermission.SP_ADMIN ||
          p.permissionType === AccessControlPermission.SP_TECH),
    ) ?? false;

  return canCreateContributor;
};
