import filterValidEntities from './filter-valid-entities';

describe('filterValidEntities', () => {
  it('should filter an array of entities, remove all entities missing uid/id and name', () => {
    // given
    // when
    const result = filterValidEntities([
      { name: 'no id' },
      { identifier: 'iznogood', name: 'there is no id or uid' },
      { id: 'what you would', uid: 'like to do without id' },
      { id: 'oh yeah!', name: 'i am the only one' },
    ] as any[]);
    // then
    expect(result).toStrictEqual([
      { id: 'oh yeah!', name: 'i am the only one' },
    ]);
  });
});
