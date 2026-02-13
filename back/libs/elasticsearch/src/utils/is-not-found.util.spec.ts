import { isNotFound } from './is-not-found.util';

describe('isNotFound', () => {
  it('should return true if statusCode is 404', () => {
    // Given
    const error = { statusCode: 404, message: 'Not Found' };

    // When
    const result = isNotFound(error);

    // Then
    expect(result).toBe(true);
  });

  it('should return false if statusCode is not 404', () => {
    // Given
    const error = { statusCode: 500, message: 'Server Error' };

    // When
    const result = isNotFound(error);

    // Then
    expect(result).toBe(false);
  });

  it('should return false if the error is undefined', () => {
    // Given
    const error = undefined;

    // When
    const result = isNotFound(error);

    // Then
    expect(result).toBe(false);
  });
});
