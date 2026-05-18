import { PartnersAccount } from '@entities/typeorm';

import { DatapassEvents, Organization } from '@fc/datapass';

export interface SimplifiedDatapassPayload {
  event: DatapassEvents;
  datapassRequestId: string;
  datapassAuthorizationId: string;
  datapassEidasLevel: string;
  state: string;
  organization: Organization;
  applicant: Pick<
    PartnersAccount,
    'email' | 'firstname' | 'lastname' | 'phone'
  >;
  technicalContact: Pick<
    PartnersAccount,
    'email' | 'firstname' | 'lastname' | 'phone'
  >;
  datapassName: string;
  scopes: string[];
}
