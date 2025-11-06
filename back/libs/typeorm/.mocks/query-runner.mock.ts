import { QueryRunner } from 'typeorm';

export function getQueryRunnerMock(): QueryRunner {
  const mock = {
    connect: jest.fn().mockReturnThis(),
    release: jest.fn().mockReturnThis(),
    startTransaction: jest.fn().mockReturnThis(),
    commitTransaction: jest.fn().mockReturnThis(),
    rollbackTransaction: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    manager: {
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      transaction: jest.fn().mockReturnThis(),
      query: jest.fn().mockReturnThis(),
      getRepository: jest.fn().mockReturnThis(),
      getCustomRepository: jest.fn().mockReturnThis(),
      getTreeRepository: jest.fn().mockReturnThis(),
      getMongoRepository: jest.fn().mockReturnThis(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    },
  };

  return mock as unknown as QueryRunner;
}
