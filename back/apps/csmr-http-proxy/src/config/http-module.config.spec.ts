import { validateStatus } from './http-module.config';

describe('validateStatus()', () => {
  it('should failed to validate status if status is not a number', () => {
    // Given
    // When
    const result = validateStatus('hello world' as unknown as number);
    // Then
    expect(result).toBe(false);
  });
  it('should validate status if status is a number greater than 99', () => {
    // Given
    // When
    const result = validateStatus(100);
    // Then
    expect(result).toBe(true);
  });

  it('should failed to validate status if status is a number less than 100', () => {
    // Given
    // When
    const result = validateStatus(99);
    // Then
    expect(result).toBe(false);
  });

  it('should validate status if status is a number less than 600', () => {
    // Given
    // When
    const result = validateStatus(599);
    // Then
    expect(result).toBe(true);
  });

  it('should failed to validate status if status is a number greater than 599', () => {
    // Given
    // When
    const result = validateStatus(600);
    // Then
    expect(result).toBe(false);
  });
});
