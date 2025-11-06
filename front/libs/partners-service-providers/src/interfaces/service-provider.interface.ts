import type { ISODate, UUIDType } from '@fc/common';

export interface ServiceProviderInterface {
  id: UUIDType;
  name: string;
  organizationName: string;
  datapassRequestId: string;
  authorizedScopes: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
}
