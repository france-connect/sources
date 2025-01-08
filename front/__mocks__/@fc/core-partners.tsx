export const CreateInstanceButton = jest.fn(() => <div data-mockid="CreateInstanceButton" />);

export const InstanceComponent = jest.fn(() => <div data-mockid="InstanceComponent" />);

export const InstancesListComponent = jest.fn(() => <div data-mockid="InstancesListComponent" />);

export const InstancesService = {
  create: jest.fn(),
  loadAll: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
};

export const VersionsService = {
  loadSchema: jest.fn(),
};
