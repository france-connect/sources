import { truncateMiddle } from './truncate-middle.util';

describe('truncateMiddle', () => {
  it('should truncate a long string with ellipsis in the middle', () => {
    // Given
    const input = 'a1b2c3d4e5f67890abcdef1234567890';

    // When
    const result = truncateMiddle(input);

    // Then
    expect(result).toBe('a1b2c3d4…34567890');
  });

  it('should not truncate a string that is exactly the minimum length', () => {
    // Given
    const input = 'a1b2c3d4…34567890';

    // When
    const result = truncateMiddle(input);

    // Then
    expect(result).toBe(input);
  });

  it('should not truncate a short string', () => {
    // Given
    const input = 'short';

    // When
    const result = truncateMiddle(input);

    // Then
    expect(result).toBe('short');
  });

  it('should handle custom visible chars parameter', () => {
    // Given
    const input = 'abcdefghijklmnopqrstuvwxyz';

    // When
    const result = truncateMiddle(input, 4);

    // Then
    expect(result).toBe('abcd…wxyz');
  });

  it('should not truncate when string length equals minimum for custom visible chars', () => {
    // Given
    const input = 'abcdefgh';

    // When
    const result = truncateMiddle(input, 4);

    // Then
    expect(result).toBe(input);
  });

  it('should handle empty string', () => {
    // When
    const result = truncateMiddle('');

    // Then
    expect(result).toBe('');
  });
});
