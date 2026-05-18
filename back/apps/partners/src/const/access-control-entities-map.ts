import {
  PartnersOrganization,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
} from '@entities/typeorm';

import { AccessControlEntity } from '../enums';

export const AccessControlEntitiesMap = {
  [AccessControlEntity.SERVICE_PROVIDER]: PartnersServiceProvider,
  [AccessControlEntity.SP_INSTANCE]: PartnersServiceProviderInstance,
  [AccessControlEntity.SP_INSTANCE_VERSION]:
    PartnersServiceProviderInstanceVersion,
  [AccessControlEntity.ORGANIZATION]: PartnersOrganization,
};
