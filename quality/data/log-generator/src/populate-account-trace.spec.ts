import { DateTime } from 'luxon';

import { ElasticSearchConfig } from './config';
import { DefaultMockDataPaths, Methods, Platforms, ServiceLog } from './enums';
import {
  chunkArray,
  debug,
  extractDates,
  extractPaths,
  generateMockData,
  injectMockData,
  warn,
} from './helpers';
import { spyOnPrivate } from './helpers/spy-on-private';
import { LogsInterface, RunParamsInterface } from './interfaces';
import { PopulateAccountTraces } from './populate-account-traces';

jest.mock('./helpers', () => ({
  ESHelper: jest.fn().mockImplementation(() => ({
    buildQuery: jest.fn().mockReturnValue({}),
    createDocument: jest.fn().mockResolvedValue(true),
    deleteByQuery: jest.fn(),
    save: jest.fn().mockResolvedValue(true),
  })),
  chunkArray: jest.fn(),
  debug: jest.fn(),
  extractDates: jest.fn(),
  extractPaths: jest.fn(),
  generateMockData: jest.fn(),
  getDatesFromLimit: jest
    .fn()
    .mockReturnValue([DateTime.now(), DateTime.now().minus({ days: 1 })]),
  getDefaultFcpLowMockDataPaths: jest.fn(),
  getXDaysAndXMonthsAgo: jest
    .fn()
    .mockReturnValue(DateTime.now().minus({ day: 1 })),
  injectMockData: jest.fn(),
  warn: jest.fn(),
}));
const mockExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

describe('PopulateAccountTraces', () => {
  let instance: PopulateAccountTraces;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new PopulateAccountTraces();
  });

  it('should warn if no methods provided', async () => {
    // When
    const params: RunParamsInterface = {
      arg1: 'arg',
      id: 'accountId',
      method: undefined as unknown as Methods,
      platform: Platforms.LEGACY,
    };
    await instance.run(params);

    // Then
    expect(warn).toHaveBeenCalledWith(
      'Please provide a method : remove / generate / inject',
    );
  });

  it('should warn if no platform provided', async () => {
    // When
    const params: RunParamsInterface = {
      arg1: 'arg',
      id: 'accountId',
      method: Methods.REMOVE,
      platform: undefined as unknown as Platforms,
    };
    await instance.run(params);

    // Then
    expect(warn).toHaveBeenCalledWith(
      'Please provide a platform : legacy / low / high / all',
    );
  });

  it('should do nothing if the method is not implemented', async () => {
    // Given
    spyOnPrivate(instance, 'getAvailableMethods').mockReturnValue([
      'UNKNOWN_METHOD',
    ]);

    // When
    const params: RunParamsInterface = {
      arg1: 'arg',
      id: 'accountId',
      method: 'UNKNOWN_METHOD' as Methods,
      platform: Platforms.LEGACY,
    };
    await instance.run(params);

    // Then
    expect(warn).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  describe('remove', () => {
    it('should remove data for the fcp-legacy platform', async () => {
      // When
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.buildQuery).toHaveBeenCalledWith(
        ElasticSearchConfig.legacyIndex,
      );
      expect(instance.esHelper.deleteByQuery).toHaveBeenCalled();
      expect(debug).toHaveBeenCalledWith('Mock data removed');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should remove data for the fcp-low platform', async () => {
      // When
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.buildQuery).toHaveBeenCalledWith(
        ElasticSearchConfig.coreV2Index,
      );
      expect(instance.esHelper.deleteByQuery).toHaveBeenCalled();
      expect(debug).toHaveBeenCalledWith('Mock data removed');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should remove data for the fcp-high platform', async () => {
      // When
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.HIGH,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.buildQuery).toHaveBeenCalledWith(
        ElasticSearchConfig.coreV2Index,
      );
      expect(instance.esHelper.deleteByQuery).toHaveBeenCalled();
      expect(debug).toHaveBeenCalledWith('Mock data removed');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should remove data for all platforms', async () => {
      // When
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.ALL,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.buildQuery).toHaveBeenCalledWith([
        ElasticSearchConfig.legacyIndex,
        ElasticSearchConfig.coreV2Index,
      ]);
      expect(instance.esHelper.deleteByQuery).toHaveBeenCalled();
      expect(debug).toHaveBeenCalledWith('Mock data removed');
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should handle errors', async () => {
      // Given
      const errorMock = new Error('test error');
      jest.mocked(instance.esHelper.deleteByQuery).mockRejectedValue(errorMock);

      // When
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should exit with 1 when deleteByQuery rejects with a non-error value', async () => {
      // Given
      jest.mocked(instance.esHelper.deleteByQuery).mockRejectedValue('boom');
      const params: RunParamsInterface = {
        method: Methods.REMOVE,
        platform: Platforms.LEGACY,
      };

      // When
      await instance.run(params);

      // Then
      expect(warn).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('generate', () => {
    it('should generate data for the specified platform', async () => {
      // Given
      jest.mocked(generateMockData).mockResolvedValue([]);

      // When
      const params: RunParamsInterface = {
        id: 'accountId',
        method: Methods.GENERATE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(generateMockData).toHaveBeenCalledWith(
        'accountId',
        DefaultMockDataPaths[Platforms.LEGACY],
        expect.any(Array),
      );
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.legacyIndex,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should extract the mock ejs paths from the parameters', async () => {
      // Given
      jest
        .mocked(extractPaths)
        .mockImplementation(() => ['mock/path1', 'mock/path2']);
      jest.mocked(generateMockData).mockResolvedValue([]);

      // When
      const params: RunParamsInterface = {
        arg1: '["mock/path1","mock/path2"]',
        id: 'accountId',
        method: Methods.GENERATE,
        platform: Platforms.HIGH,
      };
      await instance.run(params);

      // Then
      expect(generateMockData).toHaveBeenCalledWith(
        'accountId',
        ['mock/path1', 'mock/path2'],
        expect.any(Array),
      );
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should extract the dates from the parameters', async () => {
      // Given
      const dates = [DateTime.now()];
      jest.mocked(extractDates).mockImplementation(() => dates);
      jest.mocked(generateMockData).mockResolvedValue([]);

      // When
      const params: RunParamsInterface = {
        arg1: '',
        arg2: 'arg2',
        id: 'accountId',
        method: Methods.GENERATE,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(generateMockData).toHaveBeenCalledWith(
        'accountId',
        expect.any(Array),
        dates,
      );
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should default accountId to test_TRACE_USER if not provided', async () => {
      // When
      const params: RunParamsInterface = {
        method: Methods.GENERATE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(generateMockData).toHaveBeenCalledWith(
        'test_TRACE_USER',
        DefaultMockDataPaths[Platforms.LEGACY],
        expect.any(Array),
      );
    });

    it('should handle errors', async () => {
      // Given
      jest.mocked(generateMockData).mockRejectedValue(new Error('test error'));

      // When
      const params: RunParamsInterface = {
        method: Methods.GENERATE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should exit with 1 when generateMockData rejects with a non-error value', async () => {
      // Given
      jest.mocked(generateMockData).mockRejectedValue('boom');

      // When
      const params: RunParamsInterface = {
        method: Methods.GENERATE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(warn).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should exit with 1 if ElasticSearch didn't save the document", async () => {
      // Given
      jest.mocked(generateMockData).mockResolvedValue([]);
      jest.mocked(instance.esHelper.save).mockResolvedValue(false);

      // When
      const params: RunParamsInterface = {
        method: Methods.GENERATE,
        platform: Platforms.LEGACY,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.legacyIndex,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('inject', () => {
    const logFilePath = 'log-file.log';
    const mockData = ['a'] as unknown as LogsInterface[];

    it('should warn if file name not provided', async () => {
      // When
      const params: RunParamsInterface = {
        arg1: undefined,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.HIGH,
      };
      await instance.run(params);

      // Then
      expect(warn).toHaveBeenCalledWith(
        'Please provide the log file name from folder /docker/volumes/log/ to inject',
      );
    });

    it('should inject data for the FC Low platform', async () => {
      // Given
      jest.mocked(injectMockData).mockResolvedValue(mockData);
      jest.mocked(chunkArray).mockReturnValue([mockData]);

      // When
      const params: RunParamsInterface = {
        arg1: logFilePath,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(injectMockData).toHaveBeenCalledWith(logFilePath, ServiceLog.LOW);
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should inject data for the FC High platform', async () => {
      // Given
      jest.mocked(injectMockData).mockResolvedValue(mockData);
      jest.mocked(chunkArray).mockReturnValue([mockData]);

      // When
      const params: RunParamsInterface = {
        arg1: logFilePath,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.HIGH,
      };
      await instance.run(params);

      // Then
      expect(injectMockData).toHaveBeenCalledWith(logFilePath, ServiceLog.HIGH);
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should handle errors', async () => {
      // Given
      jest.mocked(injectMockData).mockRejectedValue(new Error('test error'));

      // When
      const params: RunParamsInterface = {
        arg1: 'arg',
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should exit with 0 if ElasticSearch did save one document', async () => {
      // Given
      jest.mocked(injectMockData).mockResolvedValue(mockData);
      jest.mocked(chunkArray).mockReturnValue([mockData]);

      // When
      const params: RunParamsInterface = {
        arg1: logFilePath,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        mockData,
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should exit with 0 if ElasticSearch did save several chunks', async () => {
      // Given
      const mockData = ['a', 'b', 'c'] as unknown as LogsInterface[];
      const chunkData = mockData.map((item) => [item]);

      jest.mocked(injectMockData).mockResolvedValue(mockData);
      jest.mocked(chunkArray).mockReturnValue(chunkData);

      // When
      const params: RunParamsInterface = {
        arg1: logFilePath,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.save).toHaveBeenCalledTimes(3);
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        chunkData[0],
        ElasticSearchConfig.coreV2Index,
      );
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        chunkData[1],
        ElasticSearchConfig.coreV2Index,
      );
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        chunkData[2],
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should exit with 1 when injectMockData rejects with a non-error value', async () => {
      // Given
      jest.mocked(injectMockData).mockRejectedValue('boom');
      const params: RunParamsInterface = {
        arg1: 'arg',
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };

      // When
      await instance.run(params);

      // Then
      expect(warn).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should exit with 1 if ElasticSearch didn't save the document", async () => {
      // Given
      jest.mocked(injectMockData).mockResolvedValue([]);
      jest.mocked(instance.esHelper.save).mockResolvedValue(false);

      // When
      const params: RunParamsInterface = {
        arg1: logFilePath,
        id: 'accountId',
        method: Methods.INJECT,
        platform: Platforms.LOW,
      };
      await instance.run(params);

      // Then
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.coreV2Index,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
