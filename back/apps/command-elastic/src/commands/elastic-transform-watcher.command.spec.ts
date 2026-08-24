import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CommandElasticTransformService } from '../services';
import { ElasticTransformWatcherCommand } from './elastic-transform-watcher.command';

describe('ElasticTransformWatcherCommand', () => {
  let command: ElasticTransformWatcherCommand;
  const loggerMock = getLoggerMock();

  const transformMock = { actualizeAllTransforms: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticTransformWatcherCommand,
        CommandElasticTransformService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticTransformService)
      .useValue(transformMock)
      .compile();

    command = module.get<ElasticTransformWatcherCommand>(
      ElasticTransformWatcherCommand,
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should call actualizeAllTransforms with dryRun=false when no options provided', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([]);

      // Then
      expect(
        transformMock.actualizeAllTransforms,
      ).toHaveBeenCalledExactlyOnceWith(false);
    });

    it('should call actualizeAllTransforms with dryRun=false when options is empty', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(
        transformMock.actualizeAllTransforms,
      ).toHaveBeenCalledExactlyOnceWith(false);
    });

    it('should call actualizeAllTransforms with dryRun=true when flag is set', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([], { dryRun: true });

      // Then
      expect(
        transformMock.actualizeAllTransforms,
      ).toHaveBeenCalledExactlyOnceWith(true);
    });

    it('should log start message', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        '--- Start ElasticTransformWatcherCommand ---',
      );
    });

    it('should log end message when all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        '--- End ElasticTransformWatcherCommand ---',
      );
    });

    it('should log all transforms final state message when all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        '[Command] All transform operations are in a final state',
      );
    });

    it('should set process.exitCode to 1 when not all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(process.exitCode).toBe(1);
    });

    it('should log pending message when not all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        '[Command] Some transform operations are still pending or running',
      );
    });

    it('should not log end message when not all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(false);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.debug).not.toHaveBeenCalledWith(
        '--- End ElasticTransformWatcherCommand ---',
      );
    });

    it('should not set process.exitCode when all completed', async () => {
      // Given
      transformMock.actualizeAllTransforms.mockResolvedValue(true);
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
