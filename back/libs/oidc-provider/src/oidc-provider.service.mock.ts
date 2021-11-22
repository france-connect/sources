/* istanbul ignore file */

// Declarative code
export const OidcProviderServiceMock = {
  onModuleInit: jest.fn(),
  getProvider: jest.fn(),
  reloadConfiguration: jest.fn(),
  getInteraction: jest.fn(),
  finishInteraction: jest.fn(),
  registerEvent: jest.fn(),
  registerMiddleware: jest.fn(),
};
