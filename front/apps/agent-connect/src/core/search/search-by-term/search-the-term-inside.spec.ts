import searchTheTermInside from './search-the-term-inside';

describe('searchTheTermInside', () => {
  it('should return nothing, not found', () => {
    // given
    const term = 'any value';
    const inputs = [
      {
        id: 'ministere-defense-1',
        identityProviders: ['pompiers', 'gendarmerie', "armée de l'air"],
        name: 'Ministère Défense 1',
        slug: 'ministere defense 1',
      },
    ];
    // when
    const result = searchTheTermInside(term)(inputs);
    // then
    expect(result).toStrictEqual([]);
  });

  it('should return a fuse search result', () => {
    // given
    const term = 'defense';
    const inputs = [
      {
        id: 'ministere-defense-1',
        identityProviders: ['pompiers', 'gendarmerie', "armée de l'air"],
        name: 'Ministère Défense 1',
        slug: 'ministere defense 1',
      },
    ];
    // when
    const result = searchTheTermInside(term)(inputs);
    // then
    expect(result).toStrictEqual([
      {
        item: {
          id: 'ministere-defense-1',
          identityProviders: ['pompiers', 'gendarmerie', "armée de l'air"],
          name: 'Ministère Défense 1',
          slug: 'ministere defense 1',
        },
        matches: [
          {
            indices: [[10, 16]],
            key: 'slug',
            value: 'ministere defense 1',
          },
        ],
        refIndex: 0,
      },
    ]);
  });
});
