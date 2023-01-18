/* istanbul ignore file */

// declarative file
import { ServiceProvidersConfig } from '@fc/partners';

export const ServiceProviders: ServiceProvidersConfig = {
  endpoints: {
    serviceProviders: '/api/service-providers',
    serviceProvidersConfigs: '/api/service-provider-configurations',
  },
};
