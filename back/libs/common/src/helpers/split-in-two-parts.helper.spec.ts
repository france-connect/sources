import { splitInTwoParts } from './split-in-two-parts.helper';

describe('splitInTwoParts', () => {
  it('should split an even-length string into two equal parts', () => {
    // Given
    const input = 'abcd';

    // When
    const result = splitInTwoParts(input);

    // Then
    expect(result).toEqual(['ab', 'cd']);
  });

  it('should split an odd-length string, second part has fewer chars', () => {
    // Given
    const input = 'abcde';

    // When
    const result = splitInTwoParts(input);

    // Then
    expect(result).toEqual(['abc', 'de']);
  });

  it('should an array with two empty strings when input is empty', () => {
    // Given
    const input = '';

    // When
    const result = splitInTwoParts(input);

    // Then
    expect(result).toEqual(['', '']);
  });

  it('should return string as first part when input has only 1 char', () => {
    // Given
    const input = 'x';

    // When
    const result = splitInTwoParts(input);

    // Then
    expect(result).toEqual(['x', '']);
  });
});
