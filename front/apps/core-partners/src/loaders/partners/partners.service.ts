/* istanbul ignore file */

// declarative file
import { loadAllInstances } from './load-all-instances';
import { loadAllServiceProviders } from './load-all-service-providers';
import { loadServiceProviderById } from './load-service-provider-by-id';

export const PartnersService = {
  loadAllInstances,
  loadAllServiceProviders,
  loadServiceProviderById,
};
