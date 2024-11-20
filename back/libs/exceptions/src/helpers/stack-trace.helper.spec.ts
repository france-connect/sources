import { getStackTraceArray } from './stack-trace.helper';

describe('getStackTraceArray()', () => {
  it('should return stack trace as an array', () => {
    // Given
    const stackMock = ['line1', 'line2', 'line3'];
    const errorMock = {
      stack: stackMock.join('\n'),
    };
    // When
    const result = getStackTraceArray(errorMock);
    // Then
    expect(result).toEqual(stackMock);
  });

  it('should return empty array if not stack is present in error object', () => {
    // Given
    const errorMock = {};
    // When
    const result = getStackTraceArray(errorMock);
    // Then
    expect(result).toEqual([]);
  });

  it('should concat with original error stack if provided', () => {
    // Given
    const stackMok = ['A1', 'A2'];
    const originalErrorStackMock = ['B1', 'B2'];
    const errorMock = {
      stack: stackMok.join('\n'),
      originalError: {
        stack: originalErrorStackMock.join('\n'),
      },
    };
    // When
    const result = getStackTraceArray(errorMock);
    // Then
    expect(result).toEqual([...stackMok, ...originalErrorStackMock]);
  });

  it('should work seamlessly if original original error is provided but does not have a stack', () => {
    // Given
    const stackMok = ['A1', 'A2'];
    const errorMock = {
      stack: stackMok.join('\n'),
      originalError: {},
    };
    // When
    const result = getStackTraceArray(errorMock);
    // Then
    expect(result).toEqual(stackMok);
  });
});
