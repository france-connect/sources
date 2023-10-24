import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import {
  createCSV,
  getCwdForDirectory,
  getParameterValue,
  readCSV,
} from '../helpers';
import { GenerateCountry } from './generate-country';

jest.mock('path');
jest.mock('fs');
jest.mock('../helpers');

describe('GenerateCountry', () => {
  const existsSyncMock = jest.mocked(existsSync);
  const mkdirSyncMock = jest.mocked(mkdirSync);
  const writeFileSyncMock = jest.mocked(writeFileSync);

  let consoleLogSpy;
  const targetDirectory = '/path/to/target';
  const filePath = '/path/to/target/country.csv';
  const data = [
    {
      cog: 99101,
      name: 'libcog',
      oldName: 'ancom',
      geographicCode: 'crpay',
      oldGeographicCode: 'capay',
    },
  ];

  const searchResultFileMock = [
    {
      COG: 99101,
      ACTUAL: 1,
      CAPAY: 'capay',
      CRPAY: 'crpay',
      ANI: 'ani',
      LIBCOG: 'libcog',
      LIBENR: 'libenr',
      ANCNOM: 'ancom',
      CODEISO2: 'FR',
      CODEISO3: 'FRA',
      CODENUM3: '100',
    },
  ];

  const fileContent = 'cog,name,arr\n123,City1,Arr1\n456,City2,Arr2\n';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  describe('run()', () => {
    const searchInCSVFilesMock = Symbol('csvFile') as any;
    const getParameterValueMock = jest.mocked(getParameterValue);

    beforeEach(() => {
      jest
        .spyOn(GenerateCountry, 'searchInCSVFiles')
        .mockReturnValue(searchInCSVFilesMock);
    });

    it('should log an error if the 1st CSV file is missing', async () => {
      // When
      await GenerateCountry.run([]);

      // Then
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Please provide the path to the CSV file as an argument.',
      );
    });

    it('should call searchInCSVFiles with the correct arguments when CSV file provided', async () => {
      // Given
      getParameterValueMock.mockReturnValueOnce('file1.csv');

      // When
      await GenerateCountry.run(['file1.csv']);

      // Then
      expect(GenerateCountry.searchInCSVFiles).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.searchInCSVFiles).toHaveBeenCalledWith(
        'file1.csv',
      );
    });
  });

  describe('searchInCSVFiles()', () => {
    const getCwdForDirectoryMock = jest.mocked(getCwdForDirectory);
    const joinMock = jest.mocked(join);
    const readCSVMock = jest.mocked(readCSV);
    const createCSVMock = jest.mocked(createCSV);

    beforeEach(() => {
      readCSVMock.mockResolvedValue(searchResultFileMock);
      createCSVMock.mockReturnValue(fileContent);
      existsSyncMock.mockReturnValue(false);
    });

    it('should call readCSVMock to retrieve data inside csv file', async () => {
      // When
      await GenerateCountry.searchInCSVFiles('file1.csv');

      // Then
      expect(readCSVMock).toHaveBeenCalledTimes(1);
      expect(readCSVMock).toHaveBeenCalledWith('file1.csv');
    });

    it('should call createCSV to create csv file', async () => {
      //When
      await GenerateCountry.searchInCSVFiles('file1.csv');

      // Then
      expect(createCSVMock).toHaveBeenCalledTimes(1);
      expect(createCSVMock).toHaveBeenCalledWith(data);
    });

    it('should verify and create target directory if not existing', async () => {
      // Given
      getCwdForDirectoryMock.mockReturnValue(targetDirectory);

      //When
      await GenerateCountry.searchInCSVFiles('file1.csv');

      // Then
      expect(existsSyncMock).toHaveBeenCalledWith(targetDirectory);
      expect(mkdirSyncMock).toHaveBeenCalledWith(targetDirectory, {
        recursive: true,
      });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Directory "${targetDirectory}" has been created`,
      );
    });

    it('should create csv file', async () => {
      // Given
      joinMock.mockReturnValue(filePath);

      //When
      await GenerateCountry.searchInCSVFiles('file1.csv');

      // Then
      expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, fileContent);
    });

    it('should log an error if there is an error while reading the CSV files', async () => {
      // Given
      readCSVMock.mockRejectedValue(new Error('Read CSV error'));

      await GenerateCountry.searchInCSVFiles('file1.csv');

      expect(console.log).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  });
});
