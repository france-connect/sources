import isSearchTermValid from './is-search-term-valid';

describe('isSearchTermValid', () => {
  it('should return false, term is undefined', () => {
    const term = undefined;
    const result = isSearchTermValid(term);
    expect(result).toBe(false);
  });

  it('should return false, term is empty string', () => {
    const term = '';
    const result = isSearchTermValid(term);
    expect(result).toBe(false);
  });
});
