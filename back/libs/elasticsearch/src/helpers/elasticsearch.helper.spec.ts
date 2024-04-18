import { EVENT_MAPPING } from '@fc/csmr-tracks/constants';

import * as query from './elasticsearch.helper';

describe('formatMultiMatchGroup()', () => {
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
    const request = query.formatMultiMatchGroup(undefined);
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
                  term: {
                    key: 'key1',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key2',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key3',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key4',
                  },
                },
                {
                  term: {
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
    const request = query.formatMultiMatchGroup(includeList, true);
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
                  term: {
                    key: 'key1',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key2',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key3',
                  },
                },
                {
                  term: {
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
                  term: {
                    key: 'key4',
                  },
                },
                {
                  term: {
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
    const request = query.formatMultiMatchGroup(includeList);
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
describe('formatV2query()', () => {
  it('should return es query filter by empty scope if event is DP_VERIFIED_FC_CHECKTOKEN', () => {
    // Given
    const dpVerifiedFcChecktoken = EVENT_MAPPING['checkedToken/verification'];
    const resultMock = {
      bool: {
        must: [{ term: { event: 'DP_VERIFIED_FC_CHECKTOKEN' } }],
        // es naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        must_not: [{ term: { scope: '' } }],
      },
    };
    // When
    const result = query.formatV2Query(dpVerifiedFcChecktoken);
    // Then
    expect(result).toStrictEqual(resultMock);
  });

  it('should return es query filter without must_not term if event is not DP_VERIFIED_FC_CHECKTOKEN', () => {
    // Given
    const fcVerified = EVENT_MAPPING['authentication/initial'];
    const resultMock = {
      bool: {
        must: [{ term: { event: 'FC_VERIFIED' } }],
      },
    };
    // When
    const result = query.formatV2Query(fcVerified);
    // Then
    expect(result).toStrictEqual(resultMock);
  });
});
