import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { parseCsv } from '@fc/csv';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { CsvInputService } from './csv-input.service';

jest.mock('@fc/csv', () => ({
  parseCsv: jest.fn(),
}));

describe('CsvInputService', () => {
  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const parseCsvMock = jest.mocked(parseCsv);
  const dsCsvPath = 'path/to/csv';

  const loadedCsvMock = [
    { email: 'foo@bar.com', datapassId: '12345' },
    { email: 'fizz@buzz.fr', datapassId: '67890' },
  ];

  let service: CsvInputService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvInputService, ConfigService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();
    service = module.get<CsvInputService>(CsvInputService);

    parseCsvMock.mockResolvedValue(loadedCsvMock);
    configMock.get.mockReturnValue({ dsCsvPath });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadCsv', () => {
    it('should call parseCsv with correct parameters', async () => {
      // When
      await service.loadCsv();

      // Then
      expect(configMock.get).toHaveBeenCalledWith('App');
    });

    it('should return an array of ImportDsCsvDto', async () => {
      // When
      const result = await service.loadCsv();

      // Then
      expect(result).toEqual(loadedCsvMock);
    });

    it('should ignore invalid CSV lines', async () => {
      // Given
      const invalidCsvData = [
        { email: 'invalid-email', datapassId: '12345' },
        ...loadedCsvMock,
        { email: 'another-invalid-email', datapassId: '67890' },
      ];
      parseCsvMock.mockResolvedValueOnce(invalidCsvData);

      // When
      const result = await service.loadCsv();

      // Then
      expect(result).toEqual(loadedCsvMock);
    });

    it('should log a warning for invalid lines', async () => {
      // Given
      const invalidCsvData = [{ email: 'invalid-email', datapassId: '12345' }];
      parseCsvMock.mockResolvedValueOnce(invalidCsvData);

      // When
      await service.loadCsv();

      // Then
      expect(loggerMock.warning).toHaveBeenCalledWith({
        msg: 'Invalid CSV line',
        line: invalidCsvData[0],
        errors: expect.any(Array),
      });
    });
  });
});
