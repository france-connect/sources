import cleanMinistries from './clean-ministries';

describe('cleanMinistries', () => {
  it('should remove unused props from ministries', () => {
    // given
    const inputs = [
      { id: 'min2', identityProviders: ['idp2'], name: 'min2', slug: 'min2' },
      { id: 'min1', identityProviders: ['idp1'], name: 'min1', slug: 'min1' },
    ];
    const expected = [
      { id: 'min2', identityProviders: ['idp2'], name: 'min2' },
      { id: 'min1', identityProviders: ['idp1'], name: 'min1' },
    ];
    // when
    const result = cleanMinistries(inputs);
    // then
    expect(result).toStrictEqual(expected);
  });
});
