import getSlugFromSearchTerm from './get-slug-from-search-term';

describe('getSlugFromSearchTerm', () => {
  it('should return a string without accent', () => {
    // setup
    const term = 'élevé';
    const expected = 'eleve';
    // action
    const result = getSlugFromSearchTerm(term);
    // expect
    expect(result).toStrictEqual(expected);
  });
});
