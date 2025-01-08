import * as readline from 'readline';

import { Apps, Folder } from '../enums';
import {
  readCSV,
  replaceAllOccurrences,
  ReplaceEmptyIsoCode,
  saveCsvToFile,
} from '../helpers';
import { GenerateCountry } from './generate-country';

jest.mock('../helpers');

describe('GenerateCountry', () => {
  let consoleLogSpy;

  const dataFcApps = [
    {
      cog: 99101,
      name: 'libcog',
      oldName: 'ancom',
      geographicCode: 'crpay',
      oldGeographicCode: 'capay',
    },
  ];

  const dataEidasBridge = [
    {
      CODEISO2: 'FR',
      COG: 99101,
      LIBCOG: 'libcog',
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

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  describe('run()', () => {
    const generateCsvForFcappsMock = Symbol('csvFile') as any;
    const generateCsvForEidasBridgeMock = Symbol('csvFile') as any;

    beforeEach(() => {
      jest.clearAllMocks();

      jest
        .spyOn(GenerateCountry, 'generateCsvForFcapps')
        .mockReturnValue(generateCsvForFcappsMock);

      jest
        .spyOn(GenerateCountry, 'generateCsvForEidasBridge')
        .mockReturnValue(generateCsvForEidasBridgeMock);
    });

    it('should log an error if the 1st CSV file is missing', async () => {
      // When
      await GenerateCountry.run([]);

      // Then
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Please provide the path to the CSV file as an argument.',
      );
    });

    ///////////

    it('should ask the user to choose an app when apps is not provided and call generateCsvForFcapps by default', async () => {
      // Given
      const readlineQuestionMock = jest.fn((_question, callback) => {
        callback(''); // Simulate default response
      });

      const readlineCloseMock = jest.fn();
      jest.spyOn(readline, 'createInterface').mockImplementation(
        () =>
          ({
            question: readlineQuestionMock,
            close: readlineCloseMock,
          }) as any,
      );

      // When
      await GenerateCountry.run(['file1.csv']);

      // Then
      expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
      expect(readlineCloseMock).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledWith(
        'file1.csv',
      );
    });

    it('should ask the user to choose an app and call generateCsvForEidasBridge when the user selects option 1', async () => {
      // Given
      const readlineQuestionMock = jest.fn((_question, callback) => {
        callback('1'); // Simulate user choosing option 1
      });

      const readlineCloseMock = jest.fn();
      jest.spyOn(readline, 'createInterface').mockImplementation(
        () =>
          ({
            question: readlineQuestionMock,
            close: readlineCloseMock,
          }) as any,
      );

      // When
      await GenerateCountry.run(['file1.csv']);

      // Then
      expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
      expect(readlineCloseMock).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForEidasBridge).toHaveBeenCalledTimes(
        1,
      );
      expect(GenerateCountry.generateCsvForEidasBridge).toHaveBeenCalledWith(
        'file1.csv',
      );
    });

    it('should ask the user to choose an app and call generateCsvForFcapps when the user selects option 2 or presses Enter', async () => {
      // Mock readline interface
      const readlineQuestionMock = jest.fn((_question, callback) => {
        callback('2'); // Simulate user choosing option 2
      });

      const readlineCloseMock = jest.fn();
      jest.spyOn(readline, 'createInterface').mockImplementation(
        () =>
          ({
            question: readlineQuestionMock,
            close: readlineCloseMock,
          }) as any,
      );

      // When
      await GenerateCountry.run(['file1.csv']);

      // Then
      expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
      expect(readlineCloseMock).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledWith(
        'file1.csv',
      );
    });

    //////////

    it('should call generateCsvForFcapps with the correct arguments when CSV file provided', async () => {
      // When
      await GenerateCountry.run(['file1.csv', Apps.FCAPPS]);

      // Then
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledTimes(1);
      expect(GenerateCountry.generateCsvForFcapps).toHaveBeenCalledWith(
        'file1.csv',
      );
    });

    it('should call generateCsvForEidasBridge with the correct arguments when CSV file provided', async () => {
      // When
      await GenerateCountry.run(['file1.csv', Apps.EIDAS]);

      // Then
      expect(GenerateCountry.generateCsvForEidasBridge).toHaveBeenCalledTimes(
        1,
      );
      expect(GenerateCountry.generateCsvForEidasBridge).toHaveBeenCalledWith(
        'file1.csv',
      );
    });
  });

  describe('generateCsvForFcapps()', () => {
    const replaceAllOccurrencesMock = jest.mocked(replaceAllOccurrences);
    const readCSVMock = jest.mocked(readCSV);
    const saveCsvToFileMock = jest.mocked(saveCsvToFile);

    beforeEach(() => {
      readCSVMock.mockResolvedValue(searchResultFileMock);
    });

    it('should call readCSVMock to retrieve data inside csv file', async () => {
      // When
      await GenerateCountry.generateCsvForFcapps('file1.csv');

      // Then
      expect(readCSVMock).toHaveBeenCalledTimes(1);
      expect(readCSVMock).toHaveBeenCalledWith('file1.csv');
    });

    it('should call saveCsvToFileMock to create a fc-apps csv file', async () => {
      // Given
      replaceAllOccurrencesMock
        .mockReturnValueOnce('libcog')
        .mockReturnValueOnce('ancom');

      //When
      await GenerateCountry.generateCsvForFcapps('file1.csv');

      // Then
      expect(saveCsvToFileMock).toHaveBeenCalledTimes(1);
      expect(saveCsvToFileMock).toHaveBeenCalledWith(
        dataFcApps,
        Folder.TARGET_DIRECTORY_FOR_FCAPPS,
      );
    });

    it('should log an error if there is an error while reading the CSV files', async () => {
      // Given
      readCSVMock.mockRejectedValue(new Error('Read CSV error'));

      await GenerateCountry.generateCsvForFcapps('file1.csv');

      expect(console.log).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  });

  describe('generateCsvForEidasBridge()', () => {
    const ReplaceEmptyIsoCodeMock = jest.mocked(ReplaceEmptyIsoCode);
    const readCSVMock = jest.mocked(readCSV);
    const saveCsvToFileMock = jest.mocked(saveCsvToFile);

    beforeEach(() => {
      readCSVMock.mockResolvedValue(searchResultFileMock);
    });

    it('should call readCSVMock to retrieve data inside csv file', async () => {
      // When
      await GenerateCountry.generateCsvForEidasBridge('file1.csv');

      // Then
      expect(readCSVMock).toHaveBeenCalledTimes(1);
      expect(readCSVMock).toHaveBeenCalledWith('file1.csv');
    });

    it('should call saveCsvToFileMock to create an eidas-bridge csv file', async () => {
      // Given
      ReplaceEmptyIsoCodeMock.mockReturnValueOnce('FR');

      //When
      await GenerateCountry.generateCsvForEidasBridge('file1.csv');

      // Then
      expect(saveCsvToFileMock).toHaveBeenCalledTimes(1);
      expect(saveCsvToFileMock).toHaveBeenCalledWith(
        dataEidasBridge,
        Folder.TARGET_DIRECTORY_FOR_EIDAS,
      );
    });

    it('should log an error if there is an error while reading the CSV files', async () => {
      // Given
      readCSVMock.mockRejectedValue(new Error('Read CSV error'));

      await GenerateCountry.generateCsvForEidasBridge('file1.csv');

      expect(console.log).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  });
});
