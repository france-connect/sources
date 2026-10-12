export interface PartnersConfig {
  schemas: {
    versions: string;
  };
  endpoints: {
    instance: string;
    instances: string;
    serviceProvider: string;
    serviceProviders: string;
    serviceProviderContributors: string;
    linkableInstancesByServiceProviderId: string;
    linkInstances: string;
  };
}
