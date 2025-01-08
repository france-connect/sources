export function getRepositoryMock() {
  const mock = {
    manager: {
      transaction: jest.fn(),
    },
    createQueryBuilder: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    from: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    getManyAndCount: jest.fn(),
    groupBy: jest.fn(),
    orderBy: jest.fn(),
    getQuery: jest.fn(),
    getOne: jest.fn(),
    subQuery: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    execute: jest.fn(),
    getMany: jest.fn(),
  };

  return mock;
}

export function resetRepositoryMock(mock) {
  const methods = Object.keys(mock);

  methods.forEach((method) => {
    if (typeof mock[method] === 'function') {
      mock[method].mockReturnValue(mock);
    }
  });

  mock.manager.transaction.mockReturnValue(mock);
}
