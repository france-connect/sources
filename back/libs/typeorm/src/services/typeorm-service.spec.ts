import { DataSource } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { getQueryRunnerMock } from '@mocks/typeorm';

import { TypeormService } from './typeorm-service';

describe('TypeormService', () => {
  let service: TypeormService;
  const dataSourceMock = {
    createQueryRunner: jest.fn(),
  };

  const queryRunnerMock = getQueryRunnerMock();

  const mockCallback = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],

      providers: [TypeormService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(dataSourceMock)
      .compile();

    service = module.get<TypeormService>(TypeormService);

    dataSourceMock.createQueryRunner.mockReturnValue(queryRunnerMock);
  });

  describe('withTransaction', () => {
    it('should create a query runner', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(dataSourceMock.createQueryRunner).toHaveBeenCalledOnce();
    });

    it('should connect the query runner', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(queryRunnerMock.connect).toHaveBeenCalledOnce();
    });

    it('should start a transaction', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
    });

    it('should execute the callback function', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(mockCallback).toHaveBeenCalledExactlyOnceWith(queryRunnerMock);
    });

    it('should commit the transaction when callback succeeds', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback the transaction when callback fails', async () => {
      // Given
      const error = new Error('Test error');
      mockCallback.mockImplementationOnce(() => {
        throw error;
      });

      // When
      try {
        await service.withTransaction(mockCallback);
        // Testing finally block
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}

      // Then
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalledOnce();
    });

    it('should release the query runner when callback succeeds', async () => {
      // When
      await service.withTransaction(mockCallback);

      // Then
      expect(queryRunnerMock.release).toHaveBeenCalled();
    });

    it('should release the query runner when callback fails', async () => {
      // Given
      const error = new Error('Test error');
      mockCallback.mockImplementationOnce(() => {
        throw error;
      });

      // When
      try {
        await service.withTransaction(mockCallback);
        // Testing finally block
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}

      // Then
      expect(queryRunnerMock.release).toHaveBeenCalled();
    });
  });

  describe('withQueryRunner', () => {
    it('should create a query runner', async () => {
      // When
      await service.withQueryRunner(mockCallback);

      // Then
      expect(dataSourceMock.createQueryRunner).toHaveBeenCalledOnce();
    });

    it('should connect the query runner', async () => {
      // When
      await service.withQueryRunner(mockCallback);

      // Then
      expect(queryRunnerMock.connect).toHaveBeenCalledOnce();
    });

    it('should execute the callback function', async () => {
      // When
      await service.withQueryRunner(mockCallback);

      // Then
      expect(mockCallback).toHaveBeenCalledExactlyOnceWith(queryRunnerMock);
    });

    it('should release the query runner when callback succeeds', async () => {
      // When
      await service.withQueryRunner(mockCallback);

      // Then
      expect(queryRunnerMock.release).toHaveBeenCalledOnce();
    });

    it('should release the query runner when callback fails', async () => {
      // Given
      const error = new Error('Test error');
      mockCallback.mockImplementationOnce(() => {
        throw error;
      });

      // When
      try {
        await service.withQueryRunner(mockCallback);
        // Testing finally block
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}

      // Then
      expect(queryRunnerMock.release).toHaveBeenCalledOnce();
    });
  });
});
