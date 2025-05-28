export const CreateInstanceButton = jest.fn(() => <div data-mockid="CreateInstanceButton" />);

export const InstanceComponent = jest.fn(() => <div data-mockid="InstanceComponent" />);

export const InstancesListComponent = jest.fn(() => <div data-mockid="InstancesListComponent" />);

export const PartnersService = {
  commit: jest.fn(),
  get: jest.fn(),
};

export enum Environment {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION',
}

export enum Options {
  CONFIG_NAME = 'Partners',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}
