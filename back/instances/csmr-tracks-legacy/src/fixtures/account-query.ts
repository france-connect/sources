export const accountQueryMock = {
  index: 'indexMockValue',
  body: {
    from: 0,
    size: 100,
    sort: [{ time: { order: 'desc' } }],
    query: {
      bool: {
        filter: [
          { term: { accountId: 'accountIdMockValue' } },
          { range: { time: { gte: 'now-6M/d', lt: 'now' } } },
          {
            bool: {
              should: [
                {
                  bool: {
                    must: [
                      { term: { action: 'authentication' } },
                      // Legacy naming
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      { term: { type_action: 'initial' } },
                    ],
                  },
                },
                {
                  bool: {
                    must: [
                      { term: { action: 'consent' } },
                      // Legacy naming
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      { term: { type_action: 'demandeIdentity' } },
                    ],
                  },
                },
                {
                  bool: {
                    must: [
                      { term: { action: 'consent' } },
                      // Legacy naming
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      { term: { type_action: 'demandeData' } },
                    ],
                  },
                },
                {
                  bool: {
                    must: [
                      { term: { action: 'checkedToken' } },
                      // Legacy naming
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      { term: { type_action: 'verification' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
};
