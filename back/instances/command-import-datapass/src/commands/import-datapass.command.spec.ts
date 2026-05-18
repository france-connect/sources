import { Test, TestingModule } from '@nestjs/testing';

import { DatapassEidasLevels } from '@fc/datapass';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ImportDatapassService } from '../services';
import { ImportDatapassCommand } from './import-datapass.command';

describe('ImportDatapassCommand', () => {
  const loggerMock = getLoggerMock();
  const importServiceMock = {
    importAll: jest.fn(),
    importById: jest.fn(),
  };

  let command: ImportDatapassCommand;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportDatapassCommand, LoggerService, ImportDatapassService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ImportDatapassService)
      .useValue(importServiceMock)
      .compile();

    command = module.get<ImportDatapassCommand>(ImportDatapassCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should call runGetById when options.id is defined', async () => {
      // Given
      const id = 42;
      command['runGetById'] = jest.fn();

      // When
      await command.run([], { id });

      // Then
      expect(command['runGetById']).toHaveBeenCalledExactlyOnceWith(id);
    });

    it('should call runGetAll when options.id is undefined', async () => {
      // Given
      const since = new Date('2025-01-01');
      command['runGetAll'] = jest.fn();

      // When
      await command.run([], { since });

      // Then
      expect(command['runGetAll']).toHaveBeenCalledExactlyOnceWith(
        [DatapassEidasLevels.EIDAS_1],
        false,
        since,
      );
    });

    it('should call runGetAll with eidas levels when provided', async () => {
      // Given
      const eidasMock = [
        DatapassEidasLevels.EIDAS_1,
        DatapassEidasLevels.EIDAS_2,
      ];
      command['runGetAll'] = jest.fn();

      // When
      await command.run([], { eidas: eidasMock });

      // Then
      expect(command['runGetAll']).toHaveBeenCalledExactlyOnceWith(
        eidasMock,
        false,
        undefined,
      );
    });

    it('should call runGetAll with no arguments when options is undefined', async () => {
      // Given
      command['runGetAll'] = jest.fn();

      // When
      await command.run([]);

      // Then
      expect(command['runGetAll']).toHaveBeenCalledExactlyOnceWith(
        [DatapassEidasLevels.EIDAS_1],
        false,
        undefined,
      );
    });

    it('should pass dryRun to runGetAll when provided', async () => {
      // Given
      command['runGetAll'] = jest.fn();

      // When
      await command.run([], { dryRun: true });

      // Then
      expect(command['runGetAll']).toHaveBeenCalledExactlyOnceWith(
        [DatapassEidasLevels.EIDAS_1],
        true,
        undefined,
      );
    });
  });

  describe('runGetAll', () => {
    const batchResultMock = { total: 1, success: 1, failure: 0 };

    it('should log importing message without since when since is undefined', async () => {
      // Given
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll']([], false);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        '--- Importing DataPass requests ---',
      );
    });

    it('should log importing message with ISO date when since is provided', async () => {
      // Given
      const since = new Date('2025-01-01T00:00:00.000Z');
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll']([], false, since);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        `--- Importing DataPass requests since ${since.toISOString()} ---`,
      );
    });

    it('should call importAll with since and eidasLevels', async () => {
      // Given
      const since = new Date('2025-01-01');
      const eidasLevelsMock = [DatapassEidasLevels.EIDAS_1];
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll'](eidasLevelsMock, false, since);

      // Then
      expect(importServiceMock.importAll).toHaveBeenCalledExactlyOnceWith(
        eidasLevelsMock,
        false,
        since,
      );
    });

    it('should call importAll with dryRun true when dryRun is true', async () => {
      // Given
      const since = new Date('2025-01-01');
      const eidasLevelsMock = [DatapassEidasLevels.EIDAS_1];
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll'](eidasLevelsMock, true, since);

      // Then
      expect(importServiceMock.importAll).toHaveBeenCalledExactlyOnceWith(
        eidasLevelsMock,
        true,
        since,
      );
    });

    it('should call importAll with dryRun false when dryRun is false', async () => {
      // Given
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll']([], false);

      // Then
      expect(importServiceMock.importAll).toHaveBeenCalledExactlyOnceWith(
        [],
        false,
        undefined,
      );
    });

    it('should log found count and batch summary on success', async () => {
      // Given
      importServiceMock.importAll.mockResolvedValue({
        total: 3,
        success: 2,
        failure: 1,
      });

      // When
      await command['runGetAll']([], false);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Found 3 validated request(s)',
      );
      expect(loggerMock.info).toHaveBeenCalledWith({
        message: 'DataPass import batch completed',
        success: 2,
        failure: 1,
      });
    });

    it('should log done message after successful import', async () => {
      // Given
      importServiceMock.importAll.mockResolvedValue(batchResultMock);

      // When
      await command['runGetAll']([], false);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('--- Done ---');
    });

    it('should log error when importAll throws', async () => {
      // Given
      const error = new Error('API failure');
      importServiceMock.importAll.mockRejectedValue(error);

      // When
      await command['runGetAll']([], false);

      // Then
      expect(loggerMock.err).toHaveBeenCalledExactlyOnceWith({
        message: 'Failed to import DataPass requests',
        error: error.message,
      });
    });

    it('should log error when importAll with dryRun throws', async () => {
      // Given
      const error = new Error('API failure');
      importServiceMock.importAll.mockRejectedValue(error);

      // When
      await command['runGetAll']([], true);

      // Then
      expect(loggerMock.err).toHaveBeenCalledExactlyOnceWith({
        message: 'Failed to import DataPass requests',
        error: error.message,
      });
    });

    it('should still log done message when importAll throws', async () => {
      // Given
      const error = new Error('API failure');
      importServiceMock.importAll.mockRejectedValue(error);

      // When
      await command['runGetAll']([], false);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('--- Done ---');
    });
  });

  describe('runGetById', () => {
    it('should log fetching message with the id', async () => {
      // Given
      const id = 42;
      importServiceMock.importById.mockResolvedValue(undefined);

      // When
      await command['runGetById'](id);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        `--- Importing DataPass request id=${id} ---`,
      );
    });

    it('should call importById with the provided id', async () => {
      // Given
      const id = 42;
      importServiceMock.importById.mockResolvedValue(undefined);

      // When
      await command['runGetById'](id);

      // Then
      expect(importServiceMock.importById).toHaveBeenCalledExactlyOnceWith(id);
    });

    it('should log done message after successful import by id', async () => {
      // Given
      const id = 42;
      importServiceMock.importById.mockResolvedValue(undefined);

      // When
      await command['runGetById'](id);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('--- Done ---');
    });

    it('should log error when importById throws', async () => {
      // Given
      const id = 42;
      const error = new Error('API failure');
      importServiceMock.importById.mockRejectedValue(error);

      // When
      await command['runGetById'](id);

      // Then
      expect(loggerMock.err).toHaveBeenCalledExactlyOnceWith({
        message: `Failed to import DataPass request id=${id}`,
        error: error.message,
      });
    });

    it('should still log done message when importById throws', async () => {
      // Given
      const id = 42;
      const error = new Error('API failure');
      importServiceMock.importById.mockRejectedValue(error);

      // When
      await command['runGetById'](id);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('--- Done ---');
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

  describe('parseId', () => {
    it('should parse a valid numeric string to an integer', () => {
      // Given
      const rawId = '123';

      // When
      const result = command.parseId(rawId);

      // Then
      expect(result).toBe(123);
    });

    it('should return NaN for non-numeric string', () => {
      // Given
      const rawId = 'not-a-number';

      // When
      const result = command.parseId(rawId);

      // Then
      expect(result).toBeNaN();
    });
  });

  describe('parseSince', () => {
    it('should parse a valid ISO 8601 date string to a Date object', () => {
      // Given
      const rawDate = '2025-01-01';

      // When
      const result = command.parseSince(rawDate);

      // Then
      expect(result).toEqual(new Date('2025-01-01'));
    });

    it('should return an Invalid Date for an invalid date string', () => {
      // Given
      const rawDate = 'not-a-date';

      // When
      const result = command.parseSince(rawDate);

      // Then
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result.getTime())).toBe(true);
    });
  });

  describe('parseEidas', () => {
    it('should return [EIDAS_1] when parsing "1" with no parsedLevels value', () => {
      // When
      const result = command.parseEidas('1');

      // Then
      expect(result).toEqual([DatapassEidasLevels.EIDAS_1]);
    });

    it('should return [EIDAS_2] when parsing "2" with no parsedLevels value', () => {
      // When
      const result = command.parseEidas('2');

      // Then
      expect(result).toEqual([DatapassEidasLevels.EIDAS_2]);
    });

    it('should return [EIDAS_3] when parsing "3" with no parsedLevels value', () => {
      // When
      const result = command.parseEidas('3');

      // Then
      expect(result).toEqual([DatapassEidasLevels.EIDAS_3]);
    });

    it('should accumulate values when called with parsedLevels array', () => {
      // Given
      const parsedLevels = [DatapassEidasLevels.EIDAS_1];

      // When
      const result = command.parseEidas('2', parsedLevels);

      // Then
      expect(result).toEqual([
        DatapassEidasLevels.EIDAS_1,
        DatapassEidasLevels.EIDAS_2,
      ]);
    });

    it('should not mutate the parsedLevels array', () => {
      // Given
      const parsedLevels = [DatapassEidasLevels.EIDAS_1];

      // When
      command.parseEidas('2', parsedLevels);

      // Then
      expect(parsedLevels).toEqual([DatapassEidasLevels.EIDAS_1]);
    });
  });
});
