import resolveFuseItems from './resolve-fuse-items';

describe('resolveFuseItems', () => {
  it('should return an array from a fuse search results', () => {
    // given
    const expected = [
      { id: 'one', identityProviders: ['any'], name: 'one' },
      { id: 'two', identityProviders: ['any'], name: 'two' },
      { id: 'three', identityProviders: ['any'], name: 'three' },
    ];
    const input = [
      {
        item: { id: 'one', identityProviders: ['any'], name: 'one' },
        refIndex: 0,
      },
      {
        item: { id: 'two', identityProviders: ['any'], name: 'two' },
        refIndex: 1,
      },
      {
        item: { id: 'three', identityProviders: ['any'], name: 'three' },
        refIndex: 2,
      },
    ];
    // when
    const result = resolveFuseItems(input);
    // then
    expect(result).toStrictEqual(expected);
  });
});
