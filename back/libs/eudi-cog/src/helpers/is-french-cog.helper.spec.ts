import { isFrenchCog } from './is-french-cog.helper';

describe('isFrenchCog', () => {
  it('should return true for the France COG', () => {
    // When
    const result = isFrenchCog('99100');

    // Then
    expect(result).toBe(true);
  });

  it('should return false for a foreign COG', () => {
    // When
    const result = isFrenchCog('99122');

    // Then
    expect(result).toBe(false);
  });
});
