import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import {
  createCSV,
  getCwdForDirectory,
  getParameterValue,
  readCSV,
} from '../helpers';
import { GenerateCity } from './generate-city';

jest.mock('path');
jest.mock('fs');
jest.mock('../helpers');

describe('GenerateCity', () => {
  const existsSyncMock = jest.mocked(existsSync);
  const mkdirSyncMock = jest.mocked(mkdirSync);
  const writeFileSyncMock = jest.mocked(writeFileSync);

  let consoleLogSpy;

  const targetDirectory = '/path/to/target';
  const filePath = '/path/to/target/city.csv';
  const data = [
    {
      cog: '01001',
      name: 'NCC',
      arr: '012',
      abr: 'Nom commune',
      cp: '92400',
      specificPlace: 'ligne 5',
    },
  ];

  const searchResultFile1Mock = [
    {
      TYPECOM: 'COM',
      COM: '01001',
      REG: '84',
      DEP: '01',
      CTCD: '01D',
      ARR: '012',
      TNCC: '0',
      NCC: 'NCC',
      NCCENR: 'NCCENR',
      LIBELLE: 'libelle',
      CAN: '0117',
      COMPARENT: '',
    },
    {
      TYPECOM: 'COMD',
      '#Code_commune_INSEE': '01001',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Nom_de_la_commune: 'Nom commune',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Code_postal: '92400',
      'Libell�_d_acheminement': 'libelle acheminement',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Ligne_5: 'ligne 5',
    },
  ];

  const searchResultFileNotMatchingMock = [
    {
      '#Code_commune_INSEE': '0100',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Nom_de_la_commune: 'Nom commune',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Code_postal: '92400',
      'Libell�_d_acheminement': 'libelle acheminement',
      // naming column file
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Ligne_5: 'ligne 5',
    },
  ];

  const fileContent = 'cog,name,arr\n123,City1,Arr1\n456,City2,Arr2\n';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  describe('run()', () => {
    const getParameterValueMock = jest.mocked(getParameterValue);

    beforeEach(() => {
      jest.spyOn(GenerateCity, 'searchInTwoCSVFiles');
    });

    it('should log an error if the 1st CSV file is missing', async () => {
      // When
      await GenerateCity.run([]);

      // Then
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Please provide the path to the 1st CSV file as an argument.',
      );
    });

    it('should log an error if the 2nd CSV file is missing', async () => {
      // Given
      getParameterValueMock.mockReturnValueOnce('file1.csv');

      // When
      await GenerateCity.run(['file1.csv']);

      // Then
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Please provide the path to the 2nd CSV file as an argument.',
      );
    });

    it('should call searchInTwoCSVFiles with the correct arguments when both CSV files are provided', async () => {
      // Given
      getParameterValueMock
        .mockReturnValueOnce('file1.csv')
        .mockReturnValueOnce('file2.csv');

      // When
      await GenerateCity.run(['file1.csv', 'file2.csv']);

      // Then
      expect(GenerateCity.searchInTwoCSVFiles).toHaveBeenCalledTimes(1);
      expect(GenerateCity.searchInTwoCSVFiles).toHaveBeenCalledWith(
        'file1.csv',
        'file2.csv',
      );
    });
  });

  describe('searchInTwoCSVFiles()', () => {
    const getCwdForDirectoryMock = jest.mocked(getCwdForDirectory);
    const joinMock = jest.mocked(join);
    const readCSVMock = jest.mocked(readCSV);
    const createCSVMock = jest.mocked(createCSV);

    beforeEach(() => {
      readCSVMock.mockResolvedValue(searchResultFile1Mock);
      createCSVMock.mockReturnValue(fileContent);
      existsSyncMock.mockReturnValue(false);

      jest.spyOn(GenerateCity, 'processCSVData').mockReturnValue(data);
    });

    it('should call readCSVMock to retrieve data inside csv file', async () => {
      // When
      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

      // Then
      expect(readCSVMock).toHaveBeenCalledTimes(2);
      expect(readCSVMock).toHaveBeenCalledWith('file1.csv');
      expect(readCSVMock).toHaveBeenCalledWith('file2.csv');
    });

    it('should call processCSVData to compare and create data matching between cog and #Code_commune_INSEE column', async () => {
      //When
      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

      // Then
      expect(GenerateCity.processCSVData).toHaveBeenCalledTimes(1);
      expect(GenerateCity.processCSVData).toHaveBeenCalledWith(
        searchResultFile1Mock[0],
        searchResultFile1Mock,
        '#Code_commune_INSEE',
      );
    });

    it('should call createCSV to create csv file', async () => {
      //When
      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

      // Then
      expect(createCSVMock).toHaveBeenCalledTimes(1);
      expect(createCSVMock).toHaveBeenCalledWith(data);
    });

    it('should verify and create target directory if not existing', async () => {
      // Given
      getCwdForDirectoryMock.mockReturnValue(targetDirectory);

      //When
      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

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
      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

      // Then
      expect(writeFileSyncMock).toHaveBeenCalledWith(filePath, fileContent);
    });

    it('should log an error if there is an error while reading the CSV files', async () => {
      // Given
      readCSVMock.mockRejectedValue(new Error('Read CSV error'));

      await GenerateCity.searchInTwoCSVFiles('file1.csv', 'file2.csv');

      expect(console.log).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  });

  describe('processCSVData', () => {
    it('Should return a new InseeDbCityInterface object matching from specific column', () => {
      // When
      const result = GenerateCity.processCSVData(
        searchResultFile1Mock[0],
        searchResultFile1Mock,
        '#Code_commune_INSEE',
      );

      // Then
      expect(result).toEqual(data);
    });

    it('Should return empty result if column not match', () => {
      // When
      const result = GenerateCity.processCSVData(
        searchResultFile1Mock[0],
        searchResultFileNotMatchingMock,
        '#Code_commune_INSEE',
      );

      // Then
      expect(result).toEqual([]);
    });
  });
});
