import type { PartnersConfig } from '@fc/core-partners';

export const Partners: PartnersConfig = {
  endpoints: {
    instance: '/api/instances/:instanceId',
    instances: '/api/instances',
    linkInstances: '/api/link-instances',
    linkableInstancesByServiceProviderId: '/api/linkable-instances/:serviceProviderId',
    serviceProvider: '/api/service-providers/:id',
    serviceProviders: '/api/service-providers',
  },
  schemas: {
    versions: '/api/versions/form-metadata',
  },
};
