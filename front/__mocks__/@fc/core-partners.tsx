export const CreateUnlinkedInstanceButton = jest.fn(() => (
  <div data-mockid="CreateUnlinkedInstanceButton" />
));

export const CreateLinkedInstanceButton = jest.fn(() => (
  <div data-mockid="CreateLinkedInstanceButton" />
));

export const LinkInstancesButton = jest.fn(() => <div data-mockid="LinkInstancesButton" />);

export const InstancesListComponent = jest.fn(() => <div data-mockid="InstancesListComponent" />);

export const ServiceProvidersListComponent = jest.fn(() => (
  <div data-mockid="ServiceProvidersListComponent" />
));

export const InstancePageHeaderComponent = jest.fn(() => (
  <div data-mockid="InstancePageHeaderComponent" />
));

export const InstancePageFormComponent = jest.fn(() => (
  <div data-mockid="InstancePageFormComponent" />
));

export const InstancePageNoticeComponent = jest.fn(() => (
  <div data-mockid="InstancePageNoticeComponent" />
));

export const ServiceProviderNameComponent = jest.fn(() => (
  <div data-mockid="ServiceProviderNameComponent" />
));

export const ServiceProviderDatapassComponent = jest.fn(() => (
  <div data-mockid="ServiceProviderDatapassComponent" />
));

export const ServiceProviderScopesComponent = jest.fn(() => (
  <div data-mockid="ServiceProviderScopesComponent" />
));

export const ServiceProviderSandboxesComponent = jest.fn(() => (
  <div data-mockid="ServiceProviderSandboxesComponent" />
));

// @NOTE should be renamed to ServiceProviderContributorsComponent
export const ServiceProviderPermissionsComponent = jest.fn(() => (
  <div data-mockid="ServiceProviderPermissionsComponent" />
));

export const ServiceProvidersPageNoticeComponent = jest.fn(() => (
  <div data-mockid="ServiceProvidersPageNoticeComponent" />
));

export const AuthenticationEventIdCallout = jest.fn(() => (
  <div data-mockid="AuthenticationEventIdCallout" />
));

export const PartnersService = {
  linkInstancesToServiceProvider: jest.fn(),
  loadAllInstances: jest.fn(),
  loadAllServiceProviders: jest.fn(),
  loadLinkableInstancesByServiceProviderId: jest.fn(),
  loadServiceProviderById: jest.fn(),
};

export const useHasServiceProviders = jest.fn();

export const AccessControlEntity = {
  ORGANIZATION: 'ORGANIZATION',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  SP_INSTANCE: 'SP_INSTANCE',
  SP_INSTANCE_VERSION: 'SP_INSTANCE_VERSION',
};

export const AccessControlPermission = {
  INSTANCE_CONTRIBUTOR: 'INSTANCE_CONTRIBUTOR',
  SP_ADMIN: 'SP_ADMIN',
  SP_CONTRIBUTOR: 'SP_CONTRIBUTOR',
  SP_TECH: 'SP_TECH',
};

export enum PartnersEnvironment {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION',
}

export enum CorePartnersOptions {
  CONFIG_NAME = 'Partners',
  CONFIG_EXTERNAL_URLS = 'ExternalUrls',
  NULL_SERVICE_PROVIDER_ID = '00000000-0000-0000-0000-000000000000',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}
