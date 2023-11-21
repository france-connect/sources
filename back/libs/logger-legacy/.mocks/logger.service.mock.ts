export function getLoggerMock() {
  return {
    log: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    businessEvent: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };
}
