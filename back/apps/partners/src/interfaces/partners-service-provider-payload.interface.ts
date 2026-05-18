import {
  PartnersOrganization,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import { UserInfosInterface } from './user-infos.interface';

export type CreatorPayload = Pick<UserInfosInterface, 'firstname' | 'lastname'>;

export type PartnersServiceProviderInstancePayload = Omit<
  PartnersServiceProviderInstance,
  'creator'
> & {
  creator?: Partial<CreatorPayload>;
};

export interface PartnersServiceProviderPayloadInterface {
  id: string;
  name: string;
  organization: PartnersOrganization;
  datapassRequestId: string;
  datapassScopes: string[];
  fcScopes: string[];
  createdAt: Date;
  updatedAt: Date;
  instances: PartnersServiceProviderInstancePayload[];
}
