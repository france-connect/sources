import type { ISODate, UUIDType } from '@fc/common';

export interface ServiceProviderInterface {
  id: UUIDType;
  name: string;
  organizationName: string;
  datapassRequestId: string;
  datapassScopes: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
  fcScopes: string[];
}

export type ServiceProviderItemInterface = Pick<
  ServiceProviderInterface,
  'id' | 'name' | 'organizationName' | 'datapassRequestId' | 'createdAt' | 'updatedAt'
>;
