import { linkInstancesToServiceProvider } from './link-instances-to-service-provider';
import { loadAllInstances } from './load-all-instances';
import { loadAllServiceProviders } from './load-all-service-providers';
import { loadLinkableInstancesByServiceProviderId } from './load-linkable-instances-by-service-provider-id';
import { loadServiceProviderById } from './load-service-provider-by-id';

export const PartnersService = {
  linkInstancesToServiceProvider,
  loadAllInstances,
  loadAllServiceProviders,
  loadLinkableInstancesByServiceProviderId,
  loadServiceProviderById,
};
