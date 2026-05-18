import { isErrorLike } from './is-error-like';

describe('isErrorLike', () => {
  it('should return true if the error is an instance of Error', () => {
    // Given
    const error = new Error('test');

    // When
    const result = isErrorLike(error);

    // Then
    expect(result).toBeTrue();
  });

  it('should return true if the error is an object with a message and a stack', () => {
    // Given
    const error = { message: 'test', stack: 'test' };

    // When
    const result = isErrorLike(error);

    // Then
    expect(result).toBeTrue();
  });

  it('should return false if the error is not an object with a message and a stack', () => {
    // Given
    const error = { message: 'test' };

    // When
    const result = isErrorLike(error);

    // Then
    expect(result).toBeFalse();
  });

  it('should return false if the error is not an object', () => {
    // Given
    const error = 'test';

    // When
    const result = isErrorLike(error);

    // Then
    expect(result).toBeFalse();
  });

  it('should return false if the error is null', () => {
    // Given
    const error = null;

    // When
    const result = isErrorLike(error);

    // Then
    expect(result).toBeFalse();
  });
});
