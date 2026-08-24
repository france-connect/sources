import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { InstancePublicationInterface } from './instance-publication.interface';

export interface LinkInstancesResultInterface {
  instances: PartnersServiceProviderInstance[];
  publications: InstancePublicationInterface[];
}
