import { promises as fs } from 'fs';
import { resolve } from 'path';

import { AppConfig } from '../config';
import { HelpTracerFalseLogs } from '../enums';
import { injectMockData } from './inject-mock-data';
import { safelyParseJson } from './safely-parse-json';

// Mock des dépendances
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
jest.mock('./log', () => ({
  debug: jest.fn(),
}));
jest.mock('./safely-parse-json', () => ({
  safelyParseJson: jest.fn(),
}));

describe('injectMockData', () => {
  const mockData = `{"accountId":"testId","otherField":"value1"}
    {"accountId":"testId","otherField":"value2"}
    {"accountId":"otherId","otherField":"value3"}`;

  const mockParsedData = [
    { accountId: 'testId', otherField: 'value1' },
    { accountId: 'testId', otherField: 'value2' },
    { accountId: 'otherId', otherField: 'value3' },
  ];

  const mockInjectedData = [
    {
      '@version': HelpTracerFalseLogs.TRACE_MARK,
      accountId: 'testId',
      otherField: 'value1',
      service: 'service',
    },
    {
      '@version': HelpTracerFalseLogs.TRACE_MARK,
      accountId: 'testId',
      otherField: 'value2',
      service: 'service',
    },
    {
      '@version': HelpTracerFalseLogs.TRACE_MARK,
      accountId: 'otherId',
      otherField: 'value3',
      service: 'service',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should read file and parse logs', async () => {
    // Given
    const file = 'path/to/file';
    const service = 'service';

    jest.mocked(fs.readFile).mockResolvedValue(mockData);
    jest
      .mocked(safelyParseJson)
      .mockImplementation(() => mockParsedData.shift());

    // When
    const result = await injectMockData(file, service);

    // Then
    expect(fs.readFile).toHaveBeenCalledWith(
      resolve(AppConfig.injectionBaseDir, file),
      'utf-8',
    );
    expect(safelyParseJson).toHaveBeenCalledTimes(3);
    expect(result).toEqual(mockInjectedData);
  });

  it('should handle empty logs', async () => {
    // Given
    const file = 'path/to/file';
    const service = 'service';

    jest.mocked(fs.readFile).mockResolvedValue('');
    jest
      .mocked(safelyParseJson)
      .mockImplementation(() => mockParsedData.shift());

    // When
    const result = await injectMockData(file, service);

    // Then
    expect(result).toEqual([]);
  });

  it('should throw an error if file reading fails', async () => {
    // Given
    const file = 'path/to/file';
    const service = 'service';
    const errorMessage = 'File not found';

    jest.mocked(fs.readFile).mockRejectedValue(new Error(errorMessage));
    jest
      .mocked(safelyParseJson)
      .mockImplementation(() => mockParsedData.shift());

    // When / Then
    await expect(injectMockData(file, service)).rejects.toThrow(errorMessage);
  });
});
