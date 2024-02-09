/* istanbul ignore file */

// This is a mock
export function getLoggerMock() {
  return {
    business: jest.fn(),
    emerg: jest.fn(),
    alert: jest.fn(),
    crit: jest.fn(),
    err: jest.fn(),
    warning: jest.fn(),
    notice: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}
