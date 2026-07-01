import type { EntityBaseInterface, ISODate, UUIDType } from '@fc/common';

import type { AccessControlPermission } from '../enums';
import type { InstanceInterface } from './instance.interface';
import type { OrganizationInterface } from './organization.interface';
import type { PartnersAccountInterface } from './partners-account.interface';

export interface ServiceProviderInterface extends EntityBaseInterface {
  id: UUIDType;
  name: string;
  organization: OrganizationInterface;
  datapassRequestId: string;
  datapassScopes: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
  fcScopes: string[];
  instances: InstanceInterface[];
}

export interface ServiceProviderPermissionInterface {
  account: PartnersAccountInterface;
  permissionType: AccessControlPermission;
}

export interface ServiceProviderMetaInterface {
  permissions: ServiceProviderPermissionInterface[];
}
