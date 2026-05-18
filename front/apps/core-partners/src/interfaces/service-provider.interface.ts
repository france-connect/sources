import type { ISODate, UUIDType } from '@fc/common';

export interface InstanceVersionDataInterface {
  /* eslint-disable-next-line @typescript-eslint/naming-convention -- API contract uses snake_case */
  client_id: string;
  name: string;
}

export interface InstanceCurrentVersionInterface {
  id: UUIDType;
  publicationStatus: string;
  data: InstanceVersionDataInterface;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface InstanceCreatorInterface {
  id?: UUIDType;
  email?: string;
  firstname?: string;
  lastname?: string;
}

export interface InstanceItemInterface {
  id: UUIDType;
  environment: string;
  createdAt: ISODate;
  updatedAt: ISODate;
  currentVersion: InstanceCurrentVersionInterface;
  creator?: InstanceCreatorInterface;
}

export interface PartnersOrganizationInterface {
  id: UUIDType;
  name: string;
  siret: string;
}
export interface ServiceProviderInterface {
  id: UUIDType;
  name: string;
  organization: PartnersOrganizationInterface;
  datapassRequestId: string;
  datapassScopes: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
  fcScopes: string[];
  instances: InstanceItemInterface[];
}

export type ServiceProviderItemInterface = Pick<
  ServiceProviderInterface,
  'id' | 'name' | 'organization' | 'datapassRequestId' | 'createdAt' | 'updatedAt'
>;
