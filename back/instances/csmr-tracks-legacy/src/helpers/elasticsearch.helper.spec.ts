import * as query from './elasticsearch.helper';

describe('formatMultiMatchGroupES()', () => {
  const includeList = [
    {
      key: 'key1',
      foo: 'bar1',
    },
    {
      key: 'key2',
      foo: 'bar3',
    },
    {
      key: 'key3',
      foo: 'bar3',
    },
    {
      key: 'key4',
      foo: 'bar4',
    },
  ];

  it('should generate multimatch query even without params list', () => {
    // Given
    const resultMock = {
      bool: {
        should: [],
      },
    };

    // When
    const request = query.formatMultiMatchGroupES(undefined);
    // Then
    expect(request).toStrictEqual(resultMock);
  });
  it('should generate multimatch query with AND condition', () => {
    // Given
    const resultMock = {
      bool: {
        must: [
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key1',
                  },
                },
                {
                  match: {
                    foo: 'bar1',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key2',
                  },
                },
                {
                  match: {
                    foo: 'bar3',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key3',
                  },
                },
                {
                  match: {
                    foo: 'bar3',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key4',
                  },
                },
                {
                  match: {
                    foo: 'bar4',
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // When
    const request = query.formatMultiMatchGroupES(includeList, true);
    // Then
    expect(request).toStrictEqual(resultMock);
  });

  it('should generate multimatch query with OR condition', () => {
    // Given
    const resultMock = {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key1',
                  },
                },
                {
                  match: {
                    foo: 'bar1',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key2',
                  },
                },
                {
                  match: {
                    foo: 'bar3',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key3',
                  },
                },
                {
                  match: {
                    foo: 'bar3',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    key: 'key4',
                  },
                },
                {
                  match: {
                    foo: 'bar4',
                  },
                },
              ],
            },
          },
        ],
      },
    };
    // When
    const request = query.formatMultiMatchGroupES(includeList);
    // Then
    expect(request).toStrictEqual(resultMock);
  });
});

describe('and()', () => {
  it('should add "must" query around params', () => {
    // Given
    const params = [
      {
        foo: 'barValue',
      },
      {
        bar: 'fooValue',
      },
    ];
    const resultMock = {
      bool: { must: [{ foo: 'barValue' }, { bar: 'fooValue' }] },
    };
    // When
    const result = query.and(params);
    // Then
    expect(result).toStrictEqual(resultMock);
  });
});
describe('or()', () => {
  it('should add "should" query around params', () => {
    // Given
    const params = [
      {
        foo: 'barValue',
      },
      {
        bar: 'fooValue',
      },
    ];
    const resultMock = {
      bool: { must: [{ foo: 'barValue' }, { bar: 'fooValue' }] },
    };
    // When
    const result = query.and(params);
    // Then
    expect(result).toStrictEqual(resultMock);
  });
});
