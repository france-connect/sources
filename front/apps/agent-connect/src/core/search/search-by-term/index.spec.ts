// eslint-disable-next-line
import jsonMock from './__mocks__/search-by-term.json';
import searchByTerm from './index';

describe('searchByTerm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('return an empty array, no results', () => {
    // given
    const term = 'any search valid term';
    // when
    const result = searchByTerm(jsonMock, term);
    // then
    expect(result).toStrictEqual([]);
  });

  describe.skip('Search with a ministere keywords', () => {
    it('return a list of matches by a term', () => {
      // given
      const term = 'DéFEnse';
      const expected = [
        {
          id: 'ministere-defense-1',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'pompiers',
              uid: 'pompiers',
            },
            {
              active: true,
              display: true,
              name: 'gendarmerie',
              uid: 'gendarmerie',
            },
            {
              active: true,
              display: true,
              name: "armée de l'air",
              uid: "armée de l'air",
            },
          ],
          name: 'Ministère Défense 1',
        },
      ];
      // when
      const result = searchByTerm(jsonMock, term);
      // then
      expect(result).toStrictEqual(expected);
    });

    it('return an array with ambigeous results', () => {
      // given
      const term = 'CultUR';
      const expected = [
        {
          id: 'ministere-culture-1',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'cinéma',
              uid: 'cinéma',
            },
            {
              active: true,
              display: true,
              name: 'livres',
              uid: 'livres',
            },
            {
              active: true,
              display: true,
              name: 'dessins',
              uid: 'dessins',
            },
          ],
          name: 'Ministère Culture 1',
        },
        {
          id: 'ministere-culture-2',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'cinéma 2',
              uid: 'cinéma 2',
            },
            {
              active: true,
              display: true,
              name: 'livres 2',
              uid: 'livres 2',
            },
            {
              active: true,
              display: true,
              name: 'dessins 2',
              uid: 'dessins 2',
            },
          ],
          name: 'Ministère Culture 2',
        },
      ];
      // when
      const result = searchByTerm(jsonMock, term);
      // then
      expect(result).toStrictEqual(expected);
    });
  });

  describe.skip('Search with identity provider keywords', () => {
    it('return a list of matches by a term', () => {
      // given
      const term = 'gendarmerie';
      const expected = [
        {
          id: 'ministere-defense-1',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'gendarmerie',
              uid: 'gendarmerie',
            },
          ],
          name: 'Ministère Défense 1',
        },
        {
          id: 'ministere-de-la-gendarmerie-1',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'cinéma gendarmerie',
              uid: 'cinéma gendarmerie',
            },
            {
              active: true,
              display: true,
              name: 'livres gendarmerie',
              uid: 'livres gendarmerie',
            },
            {
              active: true,
              display: true,
              name: 'dessins gendarmerie',
              uid: 'dessins gendarmerie',
            },
          ],
          name: 'Ministere de la Gendarmerie 1',
        },
        {
          id: 'ministere-de-la-gendarmerie-2',
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'canape',
              uid: 'canape',
            },
          ],
          name: 'Ministere de la Gendarmerie 2',
        },
      ];
      // when
      const result = searchByTerm(jsonMock, term);
      // then
      expect(result).toStrictEqual(expected);
    });
  });
});
