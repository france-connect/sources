export function getJwtServiceMock() {
  return {
    getFirstRelevantKey: jest.fn(),
    getKeyForToken: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    retrieveJwtHeaders: jest.fn(),
  };
}
