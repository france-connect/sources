import { DateTime } from 'luxon';

import { ElasticSearchConfig } from './config';
import { DefaultMockDataPaths, Methods, Platforms, ServiceLog } from './enums';
import {
  debug,
  extractDates,
  extractPaths,
  generateMockData,
  injectMockData,
  warn,
} from './helpers';
import { PopulateAccountTraces } from './populate-account-traces';

jest.mock('./helpers', () => ({
  ESHelper: jest.fn().mockImplementation(() => ({
    buildQuery: jest.fn().mockReturnValue({}),
    createDocument: jest.fn().mockResolvedValue(true),
    deleteByQuery: jest.fn(),
    save: jest.fn().mockResolvedValue(true),
  })),
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
    await instance.run([undefined, Platforms.LEGACY, 'accountId', 'arg']);
    // Then
    expect(warn).toHaveBeenCalledWith(
      'Please provide a method : remove / generate / inject',
    );
  });

  it('should warn if no platform provided', async () => {
    // When
    await instance.run([Methods.REMOVE, undefined, 'accountId', 'arg']);
    // Then
    expect(warn).toHaveBeenCalledWith(
      'Please provide a platform : legacy / low / high / all',
    );
  });

  describe('remove', () => {
    it('should remove data for the fcp-legacy platform', async () => {
      // When
      await instance.run([Methods.REMOVE, Platforms.LEGACY]);
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
      await instance.run([Methods.REMOVE, Platforms.LOW]);
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
      await instance.run([Methods.REMOVE, Platforms.HIGH]);
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
      await instance.run([Methods.REMOVE, Platforms.ALL]);
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
      instance.esHelper.deleteByQuery.mockRejectedValue(
        new Error('test error'),
      );
      // When
      await instance.run([Methods.REMOVE, Platforms.LEGACY]);
      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('generate', () => {
    it('should generate data for the specified platform', async () => {
      // Given
      jest.mocked(generateMockData).mockResolvedValue([]);
      // When
      await instance.run([Methods.GENERATE, Platforms.LEGACY, 'accountId']);
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
      await instance.run([
        Methods.GENERATE,
        Platforms.HIGH,
        'accountId',
        '["mock/path1","mock/path2"]',
      ]);
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
      await instance.run([
        Methods.GENERATE,
        Platforms.LOW,
        'accountId',
        '',
        'args2',
      ]);
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
      await instance.run([Methods.GENERATE, Platforms.LEGACY]);
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
      await instance.run([Methods.GENERATE, Platforms.LEGACY]);
      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should exit with 1 if ElasticSearch didn't save the document", async () => {
      // Given
      jest.mocked(generateMockData).mockResolvedValue([]);
      jest.mocked(instance.esHelper.save).mockResolvedValue(false);
      // When
      await instance.run([Methods.GENERATE, Platforms.LEGACY]);
      // Then
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.legacyIndex,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('inject', () => {
    it('should warn if file name provided', async () => {
      // When
      await instance.run([
        Methods.INJECT,
        Platforms.HIGH,
        'accountId',
        undefined,
      ]);
      // Then
      expect(warn).toHaveBeenCalledWith(
        'Please provide the log file name from folder /docker/volumes/log/ to inject',
      );
    });

    it('should inject data for the specified platform', async () => {
      // Given
      const logFilePath = 'logFile.log';
      jest.mocked(injectMockData).mockResolvedValue([]);
      // When
      await instance.run([
        Methods.INJECT,
        Platforms.LOW,
        'accountId',
        logFilePath,
      ]);
      // Then
      expect(injectMockData).toHaveBeenCalledWith(logFilePath, ServiceLog.LOW);
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
      await instance.run([Methods.INJECT, Platforms.LOW, 'accountId', 'arg']);
      // Then
      expect(warn).toHaveBeenCalledWith('test error');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should exit with 1 if ElasticSearch didn't save the document", async () => {
      // Given
      jest.mocked(injectMockData).mockResolvedValue([]);
      jest.mocked(instance.esHelper.save).mockResolvedValue(false);
      // When
      await instance.run([
        Methods.INJECT,
        Platforms.LEGACY,
        'accountId',
        'logFile.log',
      ]);
      // Then
      expect(instance.esHelper.save).toHaveBeenCalledWith(
        expect.any(Array),
        ElasticSearchConfig.legacyIndex,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
