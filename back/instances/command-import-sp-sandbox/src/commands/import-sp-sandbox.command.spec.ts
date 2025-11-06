import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';

import { getLoggerMock } from '@mocks/logger';

import { CsvInputService } from '../services/csv-input.service';
import { ImportService } from '../services/import.service';
import { ImportSpSandboxCommand } from './import-sp-sandbox.command';

describe('ImportSpSandboxCommand', () => {
  const loggerMock = getLoggerMock();
  const importServiceMock = {
    import: jest.fn(),
    diagnostic: jest.fn(),
  };
  const csvInputServiceMock = {
    loadCsv: jest.fn(),
  };
  const serviceProviderMock = {
    getList: jest.fn(),
  };

  const loadedCsvMock = Symbol('loadedCsvMock');
  const loadedDbMock = Symbol('loadedDbMock');

  let command: ImportSpSandboxCommand;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportSpSandboxCommand,
        LoggerService,
        ImportService,
        CsvInputService,
        ServiceProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ImportService)
      .useValue(importServiceMock)
      .overrideProvider(CsvInputService)
      .useValue(csvInputServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderMock)
      .compile();

    command = module.get<ImportSpSandboxCommand>(ImportSpSandboxCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should log the start of the import process', async () => {
      // When
      await command.run();

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('# Begin import');
    });

    it('should call the diagnostic method of the import service', async () => {
      // When
      await command.run();

      // Then
      expect(importServiceMock.diagnostic).toHaveBeenCalled();
    });

    it('should throw if diagnostic throws', async () => {
      // Given
      const error = new Error('test');
      importServiceMock.diagnostic.mockRejectedValue(error);

      // When / Then
      await expect(command.run()).rejects.toThrow(error);
    });

    it('should not execute import if diagnostic throws', async () => {
      // Given
      const error = new Error('test');
      importServiceMock.diagnostic.mockRejectedValue(error);

      // When
      await expect(command.run()).rejects.toThrow();

      // Then
      expect(importServiceMock.import).not.toHaveBeenCalled();
    });

    it('should load CSV data', async () => {
      // When
      await command.run();

      // Then
      expect(csvInputServiceMock.loadCsv).toHaveBeenCalledExactlyOnceWith();
    });

    it('should load MongoDB data', async () => {
      // When
      await command.run();

      // Then
      expect(serviceProviderMock.getList).toHaveBeenCalled();
    });

    it('should call the import service with the loaded data', async () => {
      // Given
      csvInputServiceMock.loadCsv.mockResolvedValue(loadedCsvMock);
      serviceProviderMock.getList.mockResolvedValue(loadedDbMock);

      // When
      await command.run();

      // Then
      expect(importServiceMock.import).toHaveBeenCalledExactlyOnceWith(
        loadedCsvMock,
        loadedDbMock,
      );
    });

    it('should log the end of the import process', async () => {
      // When
      await command.run();

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith('# End import');
    });

    it('should log an error if the import service throws an error', async () => {
      // Given
      const error = new Error('test');
      importServiceMock.import.mockRejectedValue(error);

      // When
      await expect(command.run()).rejects.toThrow();

      // Then
      expect(loggerMock.err).toHaveBeenCalledWith({
        msg: error.message,
        reason: error,
        type: error.constructor.name,
      });
    });

    it('should forward thrown error', async () => {
      // Given
      const error = new Error('test');
      importServiceMock.import.mockRejectedValue(error);

      // When / Then
      await expect(command.run()).rejects.toThrow(error);
    });
  });
});
