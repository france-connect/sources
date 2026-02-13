import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ElasticControlInvalidRequestException } from '../exceptions';
import { isNotFound } from '../utils'; // Local import
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlDestIndexService } from './elastic-control-dest-index.service';

jest.mock('../utils');

describe('ElasticControlDestIndexService', () => {
  let service: ElasticControlDestIndexService;
  const loggerMock = getLoggerMock();

  const isNotFoundMock = jest.mocked(isNotFound);

  const elasticClientMock = {
    deleteIndex: jest.fn(),
  };

  const indexIdMock = '2025-08_sp_high_month'; // Based on buildDestIndexId logic
  const dryRun = false;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticControlDestIndexService,
        LoggerService,
        ElasticControlClientService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ElasticControlClientService)
      .useValue(elasticClientMock)
      .compile();

    isNotFoundMock.mockReturnValue(false);
    elasticClientMock.deleteIndex.mockResolvedValue(undefined);

    service = module.get<ElasticControlDestIndexService>(
      ElasticControlDestIndexService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('safeDeleteDestIndex', () => {
    it('should call elastic.deleteIndex', async () => {
      // When
      await service.safeDeleteDestIndex(indexIdMock, dryRun);

      // Then
      expect(elasticClientMock.deleteIndex).toHaveBeenCalledExactlyOnceWith(
        indexIdMock,
      );
    });

    it('should log deletion', async () => {
      // When
      await service.safeDeleteDestIndex(indexIdMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[dest index] Deleted dest index "${indexIdMock}"`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service.safeDeleteDestIndex(indexIdMock, dryRun);

      // Then
      expect(elasticClientMock.deleteIndex).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[dest index] dry-run: would delete index "${indexIdMock}"`,
      );
    });

    it('should ignore 404 errors', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.deleteIndex.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(true);

      // When
      await service.safeDeleteDestIndex(indexIdMock, dryRun);

      // Then
      expect(isNotFoundMock).toHaveBeenCalledWith(error);
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[dest index] Delete ignored: index "${indexIdMock}" not found (404)`,
      );
    });

    it('should throw ElasticControlInvalidRequestException on other errors', async () => {
      // Given
      const error = new Error('other error');
      elasticClientMock.deleteIndex.mockRejectedValue(error);
      isNotFoundMock.mockReturnValueOnce(false);

      // When / Then
      await expect(
        service.safeDeleteDestIndex(indexIdMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });
});
