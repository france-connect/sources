import { PartnersAccount } from '@entities/typeorm';

import { DatapassEvents } from '@fc/datapass';

export interface SimplifiedDatapassPayload {
  event: DatapassEvents;
  datapassRequestId: string;
  state: string;
  organizationName: string;
  applicant: Pick<PartnersAccount, 'email' | 'firstname' | 'lastname'>;
  technicalContact: Pick<PartnersAccount, 'email' | 'firstname' | 'lastname'>;
  datapassName: string;
  scopes: string[];
}
