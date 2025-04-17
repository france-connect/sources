import { PartnersAccount } from '@entities/typeorm';

import { queryBuilderGetCurrentTimestamp } from '@fc/typeorm';

export type AccountInitInputInterface = Omit<
  PartnersAccount,
  'id' | 'createdAt' | 'updatedAt' | 'accountPermissions' | 'lastConnection'
> & {
  lastConnection?: typeof queryBuilderGetCurrentTimestamp;
};
