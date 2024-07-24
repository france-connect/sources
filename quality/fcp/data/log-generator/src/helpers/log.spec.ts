import { debug, warn } from './log';

let consoleLogSpy;
let consoleWarnSpy;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
});

describe('debug', () => {
  it('should display a console.log', () => {
    // Given
    const data = 'some words !';

    // When
    debug(data);

    // Then
    expect(consoleLogSpy).toHaveBeenCalledWith(' * some words !');
  });
});

describe('warn', () => {
  it('should display a console.warn', () => {
    // Given
    const data = 'some words !';

    // When
    warn(data);

    // Then
    expect(consoleWarnSpy).toHaveBeenCalledWith(' > some words !');
  });
});
