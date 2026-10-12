import type { UUIDType } from '@fc/common';

import type { InstanceInterface } from './instance.interface';

export interface LinkableInstancesPayloadInterface {
  datapassRequestId: string;
  serviceProviderId: UUIDType;
  serviceProviderName: string;
  linkableInstances: InstanceInterface[];
}
