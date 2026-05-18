import { linkInstancesToServiceProvider } from './link-instances-to-service-provider';
import { loadAllInstances } from './load-all-instances';
import { loadAllServiceProviders } from './load-all-service-providers';
import { loadLinkableInstancesByServiceProviderId } from './load-linkable-instances-by-service-provider-id';
import { loadServiceProviderById } from './load-service-provider-by-id';
import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  it('should expose partner loader functions', () => {
    expect(PartnersService.linkInstancesToServiceProvider).toBe(linkInstancesToServiceProvider);
    expect(PartnersService.loadAllInstances).toBe(loadAllInstances);
    expect(PartnersService.loadAllServiceProviders).toBe(loadAllServiceProviders);
    expect(PartnersService.loadLinkableInstancesByServiceProviderId).toBe(
      loadLinkableInstancesByServiceProviderId,
    );
    expect(PartnersService.loadServiceProviderById).toBe(loadServiceProviderById);
  });
});
