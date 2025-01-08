import { getAccessibleTitle } from './get-accessible-title.helper';

describe('getAccessibleTitle', () => {
  it('should return undefined if no arguments are provided', () => {
    // When
    const result = getAccessibleTitle();

    // Then
    expect(result).toBeUndefined();
  });

  it('should return the concatenated string if all arguments are defined', () => {
    // When
    const result = getAccessibleTitle('Title', 'Subtitle', 'Description');

    // Then
    expect(result).toBe('Title - Subtitle - Description');
  });

  it('should ignore undefined arguments and return the concatenated string', () => {
    // When
    const result = getAccessibleTitle('Title', undefined, 'Description');

    // Then
    expect(result).toBe('Title - Description');
  });

  it('should return undefined if all arguments are undefined', () => {
    // When
    const result = getAccessibleTitle(undefined, undefined, undefined);

    // Then
    expect(result).toBeUndefined();
  });
});
