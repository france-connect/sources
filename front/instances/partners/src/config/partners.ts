import type { PartnersConfig } from '@fc/core-partners';

export const Partners: PartnersConfig = {
  endpoints: {
    instances: '/api/instances',
    serviceProvider: '/api/service-providers/:id',
    serviceProviders: '/api/service-providers',
  },
  schemas: {
    versions: '/api/versions/form-metadata',
  },
};
