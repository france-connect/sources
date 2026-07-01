import { PartnersAccount, PartnersServiceProvider } from '@entities/typeorm';

import { AccessControlIdentityDto } from '@fc/access-control';

export interface InstanceCreationContextInterface {
  accountId: PartnersAccount['id'];
  email: AccessControlIdentityDto['email'];
  serviceProviderId: PartnersServiceProvider['id'];
}
