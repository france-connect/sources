/* istanbul ignore file */

// Declarative code
export function getAsyncLocalStorageMock() {
  const mock = {
    run: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  // This is necessary to mock the getter
  Object.defineProperty(mock, 'mandatory', {
    get: jest.fn(),
  });

  return mock;
}
