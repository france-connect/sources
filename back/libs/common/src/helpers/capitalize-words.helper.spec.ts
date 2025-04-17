import { capitalizeWords } from './capitalize-words.helper';

describe('capitalizeWords', () => {
  it('should return an empty string when words is undefined', () => {
    // Given
    const words = undefined;

    // When
    const result = capitalizeWords(words);

    // Then
    expect(result).toEqual('');
  });

  it('should return a capitalized word when words is a lowercase word', () => {
    // Given
    const words = 'any word mock';

    // When
    const result = capitalizeWords(words);

    // Then
    expect(result).toEqual('Any Word Mock');
  });

  it('should return a capitalized word when words is an uppercase word', () => {
    // Given
    const words = 'ANY WORD MOCK';

    // When
    const result = capitalizeWords(words);

    // Then
    expect(result).toEqual('Any Word Mock');
  });
});
