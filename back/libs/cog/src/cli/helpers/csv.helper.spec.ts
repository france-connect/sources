import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { generateCSVContent } from '@fc/csv';

import { FilesName } from '../enums';
import { SearchDbCountryInterface } from '../interface';
import { readCSV, saveCsvToFile } from './csv.helper';
import { getCwdForDirectory } from './utils.helper';

jest.mock('path');
jest.mock('fs');
jest.mock('./utils.helper');
jest.mock('@fc/csv');

describe('readCSV', () => {
  const createReadStreamMock = jest.mocked(createReadStream);

  it('should read the CSV file and resolve with results', async () => {
    // Given
    const csvFilePath = '../fixture/test.csv';
    const expectedResult = [{ col1: 'value1', col2: 'value2' }];
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback({ col1: 'value1', col2: 'value2' }); // Mock des données
        } else if (event === 'end') {
          callback();
        } else if (event === 'error') {
          callback(new Error('Mocked error'));
        }
        return mockReadStream;
      }),
    };

    createReadStreamMock.mockReturnValue(mockReadStream);

    // When
    const result = await readCSV(csvFilePath);

    // Then
    expect(result).toEqual(expectedResult);
  });

  it('should reject with an error if the CSV file reading fails', async () => {
    // Given
    const csvFilePath = '../fixure/nonexistent.csv';
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'error') {
          callback(new Error('Mocked error'));
        }
        return mockReadStream;
      }),
    };

    createReadStreamMock.mockReturnValue(mockReadStream);

    // When / Then
    await expect(readCSV(csvFilePath)).rejects.toThrowError('Mocked error');
  });
});

describe('saveCsvToFile', () => {
  let consoleLogSpy;
  const targetDirectory = '/path/to/target';
  const filePath = '/path/to/target/country.csv';
  const fileContent =
    '"cog","name","arr"\n"123","City1","Arr1"\n"456","City2","Arr2"\n';

  const dataMock = [
    {
      cog: 99101,
      name: 'libcog',
      oldName: 'ancom',
      geographicCode: 'crpay',
      oldGeographicCode: 'capay',
    },
  ] as unknown as SearchDbCountryInterface[];

  const existsSyncMock = jest.mocked(existsSync);
  const mkdirSyncMock = jest.mocked(mkdirSync);
  const writeFileSyncMock = jest.mocked(writeFileSync);
  const joinMock = jest.mocked(join);
  const getCwdForDirectoryMock = jest.mocked(getCwdForDirectory);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    getCwdForDirectoryMock.mockReturnValue(targetDirectory);
    existsSyncMock.mockReturnValue(false);
    joinMock.mockReturnValue(filePath);

    jest.mocked(generateCSVContent).mockImplementation(() => fileContent);

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  it('should call getCwdForDirectory', () => {
    //When
    saveCsvToFile(dataMock, filePath);

    // Then
    expect(getCwdForDirectoryMock).toHaveBeenCalledExactlyOnceWith(filePath);
  });

  it('should call generateCSVContent', () => {
    //When
    saveCsvToFile(dataMock, filePath);

    // Then
    expect(generateCSVContent).toHaveBeenCalledTimes(1);
    expect(generateCSVContent).toHaveBeenCalledWith(dataMock);
  });

  it('should verify and create target directory if not existing', () => {
    //When
    saveCsvToFile(dataMock, filePath);

    // Then
    expect(existsSyncMock).toHaveBeenCalledWith(targetDirectory);
    expect(mkdirSyncMock).toHaveBeenCalledWith(targetDirectory, {
      recursive: true,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Directory "${targetDirectory}" has been created`,
    );
  });

  it('should create csv file', () => {
    // Given
    const filenameCsv = FilesName.COUNTRY;

    existsSyncMock.mockReturnValue(true);

    //When
    saveCsvToFile(dataMock, filePath);

    // Then
    expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, fileContent, {
      encoding: 'utf8',
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `${filenameCsv} was created with success into ${filePath}`,
    );
  });
});
