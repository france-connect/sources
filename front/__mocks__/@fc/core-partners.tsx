export const CreateInstanceButton = jest.fn(() => <div data-mockid="CreateInstanceButton" />);

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

export const ServiceProvidersPageNoticeComponent = jest.fn(() => (
  <div data-mockid="ServiceProvidersPageNoticeComponent" />
));

export const AuthenticationEventIdCallout = jest.fn(() => (
  <div data-mockid="AuthenticationEventIdCallout" />
));

export const PartnersService = {
  loadAllInstances: jest.fn(),
  loadAllServiceProviders: jest.fn(),
};

export enum Environment {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION',
}

export enum CorePartnersOptions {
  CONFIG_NAME = 'Partners',
  CONFIG_EXTERNAL_URLS = 'ExternalUrls',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}
