import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { FilesName } from '../enums';
import { createCSV, getCwdForDirectory, readCSV } from '../helpers';
import {
  InseeDbCityCurrentInterface,
  InseeDbCitySince1943Interface,
  PostalCodesDbCurrentInterface,
  SearchDbCityInterface,
} from '../interface';
import { GenerateCity, MATCHING_COLUMN } from './generate-city';

jest.mock('path');
jest.mock('fs');
jest.mock('../helpers');

describe('GenerateCity', () => {
  let service: GenerateCity;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.spyOn(console, 'log').mockImplementation();

    service = new GenerateCity();
  });

  describe('run()', () => {
    beforeEach(() => {
      service['mergeCsvFiles'] = jest.fn();
    });

    it('should log an error if the 1st CSV file is missing', async () => {
      // When
      await service.run([]);

      // Then
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        'Please provide the path to the 1st CSV file as an argument (insee file since 1943).',
      );
    });

    it('should log an error if the 2nd CSV file is missing', async () => {
      // When
      await service.run(['file1.csv']);

      // Then
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        'Please provide the path to the 2nd CSV file as an argument (La poste file).',
      );
    });

    it('should log an error if the 3rd CSV file is missing', async () => {
      // When
      await service.run(['file1.csv', 'file3.csv']);

      // Then
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        'Please provide the path to the 3nd CSV file as an argument (insee current file).',
      );
    });

    it('should call mergeCsvFiles with the correct arguments when both CSV files are provided', async () => {
      // When
      await service.run(['file1.csv', 'file2.csv', 'file3.csv']);

      // Then
      expect(service['mergeCsvFiles']).toHaveBeenCalledTimes(1);
      expect(service['mergeCsvFiles']).toHaveBeenCalledWith(
        'file1.csv',
        'file2.csv',
        'file3.csv',
      );
    });
  });

  describe('mergeCsvFiles()', () => {
    const inseeDbCitySince1943Mock = Symbol('inseeDbCitySince1943Mock');
    const postalCodesDbCurrentMock = Symbol('postalCodesDbCurrentMock');
    const inseeDbCityCurrentMock = Symbol('inseeDbCityCurrentMock');

    const prepareDataBaseResultMock = [Symbol('prepareDataBaseResultMock')];
    const matchPostalCodeResultMock = [Symbol('matchPostalCodeResultMock')];
    const matchOldCogResultMock = [Symbol('matchOldCogResultMock')];
    const removeDuplicatesResultMock = [Symbol('removeDuplicatesResultMock')];

    beforeEach(() => {
      jest
        .mocked(readCSV)
        .mockResolvedValueOnce(inseeDbCitySince1943Mock)
        .mockResolvedValueOnce(postalCodesDbCurrentMock)
        .mockResolvedValueOnce(inseeDbCityCurrentMock);

      service['prepareDataBase'] = jest
        .fn()
        .mockReturnValue(prepareDataBaseResultMock);
      service['matchPostalCode'] = jest
        .fn()
        .mockReturnValue(matchPostalCodeResultMock);
      service['matchOldCog'] = jest.fn().mockReturnValue(matchOldCogResultMock);
      service['removeDuplicates'] = jest
        .fn()
        .mockReturnValue(removeDuplicatesResultMock);
      service['writeCsvFile'] = jest.fn();
    });

    it('should read all CSV files', async () => {
      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(readCSV).toHaveBeenCalledTimes(3);
      expect(readCSV).toHaveBeenNthCalledWith(1, 'file1.csv');
      expect(readCSV).toHaveBeenNthCalledWith(2, 'file2.csv');
      expect(readCSV).toHaveBeenNthCalledWith(3, 'file3.csv');
    });

    it('should call prepareDataBase with the correct arguments', async () => {
      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(service['prepareDataBase']).toHaveBeenCalledTimes(1);
      expect(service['prepareDataBase']).toHaveBeenCalledWith(
        inseeDbCityCurrentMock,
      );
    });

    it('should call matchPostalCode with the correct arguments', async () => {
      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(service['matchPostalCode']).toHaveBeenCalledTimes(1);
      expect(service['matchPostalCode']).toHaveBeenCalledWith(
        prepareDataBaseResultMock,
        postalCodesDbCurrentMock,
      );
    });

    it('should call matchOldCog with the correct arguments', async () => {
      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(service['matchOldCog']).toHaveBeenCalledTimes(1);
      expect(service['matchOldCog']).toHaveBeenCalledWith(
        matchPostalCodeResultMock,
        inseeDbCitySince1943Mock,
      );
    });

    it('should call removeDuplicates with the correct arguments', async () => {
      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(service['removeDuplicates']).toHaveBeenCalledTimes(1);
      expect(service['removeDuplicates']).toHaveBeenCalledWith(
        matchOldCogResultMock,
      );
    });

    it('should call writeCsvFile with sorted results from removeDuplicates by name', async () => {
      // Given
      const unsortedResults = [
        { name: 'B' },
        { name: 'A' },
        { name: 'C' },
      ] as SearchDbCityInterface[];
      const sortedResults = [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
      ] as SearchDbCityInterface[];
      jest
        .mocked(service['removeDuplicates'])
        .mockReturnValueOnce(unsortedResults);

      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(service['writeCsvFile']).toHaveBeenCalledTimes(1);
      expect(service['writeCsvFile']).toHaveBeenCalledWith(sortedResults);
    });

    it('should log an error if something goes wrong', async () => {
      // Given
      jest.mocked(readCSV).mockReset().mockRejectedValueOnce('error');
      jest.spyOn(console, 'error').mockImplementation();

      // When
      await service['mergeCsvFiles']('file1.csv', 'file2.csv', 'file3.csv');

      // Then
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Error:', 'error');
    });
  });

  describe('prepareDataBase()', () => {
    const searchResultInseeCurrentMock = [
      {
        COM: '12345',
        NCC: 'City 1',
        TYPECOM: 'COM',
      },
      {
        COM: '12346',
        NCC: 'City 2',
        TYPECOM: 'COMD',
      },
      {
        COM: '12347',
        NCC: 'City 3',
        TYPECOM: 'COMA',
      },
    ] as InseeDbCityCurrentInterface[];
    const expectedResult = [
      {
        cog: '12345',
        name: 'City 1',
      },
      {
        cog: '12347',
        name: 'City 3',
      },
    ] as Partial<SearchDbCityInterface>[];

    it('should filter out COMD TYPECOM and format all cities', () => {
      // When
      const result = service['prepareDataBase'](searchResultInseeCurrentMock);

      // Then
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe('matchPostalCode()', () => {
    const dataBaseMock = [
      {
        cog: '12345',
        name: 'City 1',
      },
      {
        cog: '12347',
        name: 'City 3',
      },
    ] as Partial<SearchDbCityInterface>[];
    const searchResultPostalCodesMock = [
      {
        [MATCHING_COLUMN]: '12345',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Code_postal: '92345',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Nom_de_la_commune: 'Ct_1',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Ligne_5: 'Specific place 1',
      },
      {
        [MATCHING_COLUMN]: '12347',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Code_postal: '92347',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Nom_de_la_commune: 'Ct_3',
        // CSV format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Ligne_5: 'Specific place 3',
      },
    ] as PostalCodesDbCurrentInterface[];
    const expectedResult = [
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
      {
        cog: '12347',
        name: 'City 3',
        abr: 'Ct_3',
        cp: '92347',
        specificPlace: 'Specific place 3',
      },
    ] as Partial<SearchDbCityInterface>[];

    it('should complete each city with postal code, abbreviation and specific place name', () => {
      // When
      const result = service['matchPostalCode'](
        dataBaseMock,
        searchResultPostalCodesMock,
      );

      // Then
      expect(result).toStrictEqual(expectedResult);
    });

    it('should return undefined fields when no postal code is found', () => {
      // Given
      const searchResultPostalCodesMock = [
        {
          [MATCHING_COLUMN]: '12345',
          // CSV format
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Code_postal: '92345',
          // CSV format
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Nom_de_la_commune: 'Ct_1',
          // CSV format
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Ligne_5: 'Specific place 1',
        },
      ] as any;
      const expectedResult = [
        {
          cog: '12345',
          name: 'City 1',
          abr: 'Ct_1',
          cp: '92345',
          specificPlace: 'Specific place 1',
        },
        {
          cog: '12347',
          name: 'City 3',
          abr: undefined,
          cp: undefined,
          specificPlace: undefined,
        },
      ] as Partial<SearchDbCityInterface>[];

      // When
      const result = service['matchPostalCode'](
        dataBaseMock,
        searchResultPostalCodesMock,
      );

      // Then
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe('matchOldCog()', () => {
    const currentsearchData = [
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
      {
        cog: '12347',
        name: 'City 3',
        abr: 'Ct_3',
        cp: '92347',
        specificPlace: 'Specific place 3',
      },
    ] as SearchDbCityInterface[];

    const searchResultInseeSince1943Mock = [
      {
        COM: '52345',
        NCC: 'City 1',
      },
      {
        COM: '52346',
        NCC: 'City 2',
      },
      {
        COM: '52347',
        NCC: 'City 3',
      },
    ] as InseeDbCitySince1943Interface[];

    const expectedResult = [
      currentsearchData[0],
      {
        ...currentsearchData[0],
        cog: '52345',
        cp: 'N/A',
      },
      currentsearchData[1],
      {
        ...currentsearchData[1],
        cog: '52347',
        cp: 'N/A',
      },
    ] as Partial<SearchDbCityInterface>[];

    it('should filter out duplicates, then complete each city with old cog, then sort by name', () => {
      // When
      const result = service['matchOldCog'](
        currentsearchData,
        searchResultInseeSince1943Mock,
      );

      // Then
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe('removeDuplicates()', () => {
    const rawSearchDataMock = [
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
      {
        cog: '12347',
        name: 'City 3',
        abr: 'Ct_3',
        cp: '92347',
        specificPlace: 'Specific place 3',
      },
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
    ] as SearchDbCityInterface[];

    const expectedSearchDataMock = [
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
      {
        cog: '12347',
        name: 'City 3',
        abr: 'Ct_3',
        cp: '92347',
        specificPlace: 'Specific place 3',
      },
    ] as SearchDbCityInterface[];

    it('should remove duplicates pairs cog / name', () => {
      // When
      const result = service['removeDuplicates'](rawSearchDataMock);

      // Then
      expect(result).toStrictEqual(expectedSearchDataMock);
    });
  });

  describe('writeCsvFile()', () => {
    // Given
    const targetDirectoryPathMock = 'targetDirectoryPath';
    const searchDataMock = [
      {
        cog: '12345',
        name: 'City 1',
        abr: 'Ct_1',
        cp: '92345',
        specificPlace: 'Specific place 1',
      },
      {
        cog: '12347',
        name: 'City 3',
        abr: 'Ct_3',
        cp: '92347',
        specificPlace: 'Specific place 3',
      },
    ] as SearchDbCityInterface[];

    beforeEach(() => {
      jest.mocked(getCwdForDirectory).mockReturnValue(targetDirectoryPathMock);
    });

    it('should get the target directory path', () => {
      // Given
      const expectedPath = '/docker/volumes/fc-apps/insee-db';

      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(getCwdForDirectory).toHaveBeenCalledTimes(1);
      expect(getCwdForDirectory).toHaveBeenCalledWith(expectedPath);
    });

    it('should generate the CSV file content', () => {
      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(createCSV).toHaveBeenCalledTimes(1);
      expect(createCSV).toHaveBeenCalledWith(searchDataMock);
    });

    it('should check if the target directory exists', () => {
      // Given

      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(existsSync).toHaveBeenCalledTimes(1);
      expect(existsSync).toHaveBeenCalledWith(targetDirectoryPathMock);
    });

    it('should create the target directory if it does not exist', () => {
      // Given
      jest.mocked(getCwdForDirectory).mockReturnValue(targetDirectoryPathMock);
      jest.mocked(existsSync).mockReturnValue(false);

      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(mkdirSync).toHaveBeenCalledTimes(1);
      expect(mkdirSync).toHaveBeenCalledWith(targetDirectoryPathMock, {
        recursive: true,
      });
    });

    it('should join the target directory path with the file name', () => {
      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(join).toHaveBeenCalledTimes(1);
      expect(join).toHaveBeenCalledWith(
        targetDirectoryPathMock,
        FilesName.CITY,
      );
    });

    it('should write the CSV file', () => {
      // Given
      const filePathMock = 'filePathMock';
      jest.mocked(join).mockReturnValue(filePathMock);

      // When
      service['writeCsvFile'](searchDataMock);

      // Then
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith(
        filePathMock,
        createCSV(searchDataMock),
      );
    });
  });
});
