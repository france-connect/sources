import { PartnersAccount } from '@entities/typeorm';

export type AccountInitInputInterface = Omit<
  PartnersAccount,
  'id' | 'createdAt' | 'updatedAt' | 'accountPermissions' | 'lastConnection'
> & { lastConnection?: Function };
