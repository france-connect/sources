import { getAccessibleTitle } from './get-accessible-title.helper';

describe('getAccessibleTitle', () => {
  it('should return undefined if no arguments are provided', () => {
    // when
    const result = getAccessibleTitle();

    // then
    expect(result).toBeUndefined();
  });

  it('should return the concatenated string if all arguments are defined', () => {
    // when
    const result = getAccessibleTitle('Title', 'Subtitle', 'Description');

    // then
    expect(result).toBe('Title - Subtitle - Description');
  });

  it('should ignore undefined arguments and return the concatenated string', () => {
    // when
    const result = getAccessibleTitle('Title', undefined, 'Description');

    // then
    expect(result).toBe('Title - Description');
  });

  it('should return undefined if all arguments are undefined', () => {
    // when
    const result = getAccessibleTitle(undefined, undefined, undefined);

    // then
    expect(result).toBeUndefined();
  });
});
