import { resolve } from 'path';

import { renderFile } from 'ejs';
import { DateTime } from 'luxon';

import { AppConfig } from '../config';
import { HelpTracerFalseLogs } from '../enums';
import { generateMockData } from './generate-mock-data';
import { debug } from './log';
import { safelyParseJson } from './safely-parse-json';

jest.mock('path');
jest.mock('./safely-parse-json');
jest.mock('./log', () => ({
  debug: jest.fn(),
}));
jest.mock('ejs', () => ({
  renderFile: jest.fn(),
}));

describe('generateMockData', () => {
  const id = '123';
  const mockDataPaths = ['fcp-legacy/mock1.ejs', 'fcp-legacy/mock2.ejs'];
  const dates = [DateTime.now()] as unknown as DateTime[];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(safelyParseJson).mockImplementation(() => ({
      accountId: id,
      time: Symbol('date'),
    }));
    jest.mocked(resolve).mockImplementation((_, file) => `/resolved/${file}`);
  });

  it('should generate mock data correctly', async () => {
    // Given
    const resolvedPaths = mockDataPaths.map((file) => `/resolved/${file}`);
    jest.mocked(renderFile).mockResolvedValue('<log></log>');

    // When
    const result = await generateMockData(id, mockDataPaths, dates);

    // Then
    expect(debug).toHaveBeenCalledWith('Get mockData fullpaths');
    expect(resolve).toHaveBeenCalledTimes(mockDataPaths.length);
    expect(resolve).toHaveBeenCalledWith(
      AppConfig.fixturesBaseDir,
      mockDataPaths[0],
    );
    expect(resolve).toHaveBeenCalledWith(
      AppConfig.fixturesBaseDir,
      mockDataPaths[1],
    );

    expect(debug).toHaveBeenCalledWith(
      `Prepare mock order for ${dates.join(',')}`,
    );
    expect(renderFile).toHaveBeenCalledTimes(dates.length);
    dates.forEach((date, index) => {
      expect(renderFile).toHaveBeenCalledWith(
        resolvedPaths[index % resolvedPaths.length],
        {
          accountId: id,
          time: date.toMillis(),
        },
      );
    });

    expect(debug).toHaveBeenCalledWith(`Render ${dates.length} group of mocks`);
    expect(debug).toHaveBeenCalledWith(
      `Join ${dates.length} group of generated mocks`,
    );
    expect(debug).toHaveBeenCalledWith('Parse logs from source');

    expect(safelyParseJson).toHaveBeenCalledTimes(dates.length);
    expect(result).toHaveLength(dates.length);
    result.forEach((log) => {
      expect(log).toEqual(
        expect.objectContaining({
          '@version': HelpTracerFalseLogs.TRACE_MARK,
          accountId: id,
        }),
      );
    });
  });

  it('should handle multiple lines in mock data', async () => {
    // Given
    jest.mocked(renderFile).mockResolvedValue('<log></log>\n<log></log>');
    // When
    const result = await generateMockData(id, mockDataPaths, dates);
    // Then
    expect(result).toHaveLength(dates.length * 2);
  });

  it('should handle empty lines in mock data', async () => {
    // Given
    jest.mocked(renderFile).mockResolvedValue('<log></log>\n\n<log></log>');
    // When
    const result = await generateMockData(id, mockDataPaths, dates);
    // Then
    expect(result).toHaveLength(dates.length * 2);
  });

  it('should handle empty mock data', async () => {
    // Given
    jest.mocked(renderFile).mockResolvedValue('');
    // When
    const result = await generateMockData(id, mockDataPaths, dates);
    // Then
    expect(result).toHaveLength(0);
  });

  it('should throw if an error occured while parsing the  mock data', async () => {
    // Given
    jest.mocked(renderFile).mockResolvedValue('<log></log>');
    const mockError = new Error('Invalid JSON');
    jest.mocked(safelyParseJson).mockImplementation(() => {
      throw mockError;
    });
    // When
    await expect(generateMockData(id, mockDataPaths, dates)).rejects.toThrow(
      mockError,
    );
  });
});
