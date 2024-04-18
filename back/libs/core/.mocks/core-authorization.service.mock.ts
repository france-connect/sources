export function getCoreAuthorizationServiceMock() {
  return {
    getAuthorizeUrl: jest.fn(),
  };
}
