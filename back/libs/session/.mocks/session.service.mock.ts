export function getSessionServiceMock() {
  return {
    init: jest.fn(),
    attach: jest.fn(),
    destroy: jest.fn(),
    detach: jest.fn(),
    duplicate: jest.fn(),
    get: jest.fn(),
    getAlias: jest.fn(),
    reset: jest.fn(),
    set: jest.fn(),
    setAlias: jest.fn(),
  };
}
