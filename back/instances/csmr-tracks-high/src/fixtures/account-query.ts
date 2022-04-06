/* istanbul ignore file */

// Declarative code
export const accountQueryMock = {
  index: 'indexMockValue',
  body: {
    from: 0,
    size: 100,
    sort: [
      {
        time: {
          order: 'desc',
        },
      },
    ],
    query: {
      bool: {
        filter: [
          { term: { accountId: 'accountIdMockValue' } },
          { range: { time: { gte: 'now-6M/d', lt: 'now' } } },
          {
            terms: {
              event: [
                'FC_VERIFIED',
                'FC_DATATRANSFER_CONSENT_IDENTITY',
                'FC_DATATRANSFER_CONSENT_DATA',
                'DP_REQUESTED_FC_CHECKTOKEN',
              ],
            },
          },
        ],
      },
    },
  },
};
