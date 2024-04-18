export function getSessionServiceMock() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    getId: jest.fn(),

    reset: jest.fn(),
    initCache: jest.fn(),
    init: jest.fn(),
    destroy: jest.fn(),
    commit: jest.fn(),
    duplicate: jest.fn(),
    refresh: jest.fn(),
    detach: jest.fn(),

    getSessionIdFromCookie: jest.fn(),

    getDataFromBackend: jest.fn(),
    expire: jest.fn(),
    setAlias: jest.fn(),
    getAlias: jest.fn(),
  };
}
