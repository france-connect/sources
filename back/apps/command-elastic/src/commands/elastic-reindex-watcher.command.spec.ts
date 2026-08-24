import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CommandElasticReindexService } from '../services';
import { ElasticReindexWatcherCommand } from './elastic-reindex-watcher.command';

describe('ElasticReindexWatcherCommand', () => {
  let command: ElasticReindexWatcherCommand;
  const loggerMock = getLoggerMock();

  const reindexMock = { actualizeAllReindexes: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticReindexWatcherCommand,
        CommandElasticReindexService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticReindexService)
      .useValue(reindexMock)
      .compile();

    command = module.get<ElasticReindexWatcherCommand>(
      ElasticReindexWatcherCommand,
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should call actualizeAllReindexes with dryRun=false when no options provided', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([]);

      // Then
      expect(reindexMock.actualizeAllReindexes).toHaveBeenCalledExactlyOnceWith(
        false,
      );
    });

    it('should call actualizeAllReindexes with dryRun=false when options is empty', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(reindexMock.actualizeAllReindexes).toHaveBeenCalledExactlyOnceWith(
        false,
      );
    });

    it('should call actualizeAllReindexes with dryRun=true when flag is set', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([], { dryRun: true });

      // Then
      expect(reindexMock.actualizeAllReindexes).toHaveBeenCalledExactlyOnceWith(
        true,
      );
    });

    it('should log start message', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        '--- Start ElasticReindexWatcherCommand ---',
      );
    });

    it('should log end message when all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        '--- End ElasticReindexWatcherCommand ---',
      );
    });

    it('should log all reindex final state message when all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        '[Command] All reindex operations are in a final state',
      );
    });

    it('should set process.exitCode to 1 when not all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(process.exitCode).toBe(1);
    });

    it('should log pending message when not all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        '[Command] Some reindex operations are still pending or running',
      );
    });

    it('should not log end message when not all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.info).not.toHaveBeenCalledWith(
        '--- End ElasticReindexWatcherCommand ---',
      );
    });

    it('should not set process.exitCode when all completed', async () => {
      // Given
      reindexMock.actualizeAllReindexes.mockResolvedValue(true);
      process.exitCode = undefined;

      // When
      await command.run([], {});

      // Then
      expect(process.exitCode).toBeUndefined();
    });
  });

  describe('parseDryRun', () => {
    it('should return true', () => {
      // When
      const result = command.parseDryRun();

      // Then
      expect(result).toBe(true);
    });
  });
});
