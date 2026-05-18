import { useAccountContext } from '@fc/account';

import { AccessControlEntity, CorePartnersOptions } from '../../enums';
import type { PartnersUserInfosInterface } from '../../interfaces';

export const useHasServiceProviders = () => {
  const { userinfos } = useAccountContext<PartnersUserInfosInterface>();

  const hasServiceProviders =
    userinfos?.permissions.some(
      (p) =>
        p.entity === AccessControlEntity.SERVICE_PROVIDER &&
        p.entityId !== CorePartnersOptions.NULL_SERVICE_PROVIDER_ID,
    ) ?? false;

  return hasServiceProviders;
};
