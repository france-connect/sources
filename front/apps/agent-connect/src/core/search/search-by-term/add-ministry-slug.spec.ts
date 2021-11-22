import addMinistrySlug from './add-ministry-slug';

const ministries = [
  {
    id: 'ministere-culture-1',
    identityProviders: ['cinéma', 'livres', 'dessins'],
    name: 'Ministère Culture',
  },
  {
    id: 'ministere-defense-1',
    identityProviders: ['pompiers', 'gendarmerie', "armée de l'air"],
    name: 'Ministère Défense',
  },
];

describe('addMinistrySlug', () => {
  it('should add a slug property for each ministry in a list', () => {
    // when
    const result = addMinistrySlug(ministries);
    // then
    expect(result).toStrictEqual([
      {
        id: 'ministere-culture-1',
        identityProviders: ['cinéma', 'livres', 'dessins'],
        name: 'Ministère Culture',
        slug: 'ministere culture',
      },
      {
        id: 'ministere-defense-1',
        identityProviders: ['pompiers', 'gendarmerie', "armée de l'air"],
        name: 'Ministère Défense',
        slug: 'ministere defense',
      },
    ]);
  });
});
