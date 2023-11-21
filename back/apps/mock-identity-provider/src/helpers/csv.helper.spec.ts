import { CsvParserStream, parseFile, Row } from '@fast-csv/parse';
import { PassThrough } from 'stream';

import { Csv } from '@fc/csv/interfaces';

import {
  parseCsv,
  removeEmptyProperties,
  transformColumnsIntoBoolean,
} from './csv.helper';

jest.mock('@fast-csv/parse');

describe('csvHelper', () => {
  describe('parseCsv()', () => {
    const parseFileMock = jest.mocked(parseFile);
    let streamMock;

    const pathMock = '/eur';
    const fastCsvOptsMock = {
      trim: true,
      ignoreEmpty: true,
      headers: true,
    };

    beforeEach(() => {
      streamMock = new PassThrough();
      parseFileMock.mockReturnValueOnce(
        streamMock as CsvParserStream<Row<any>, Row<any>>,
      );
    });

    it('should call parseFile() with citizenDatabasePathMock and fastCsvOptsMock', async () => {
      // Given
      streamMock.end();

      // When
      await parseCsv(pathMock, fastCsvOptsMock);

      // Then
      expect(parseFileMock).toHaveBeenCalledTimes(1);
      expect(parseFileMock).toHaveBeenCalledWith(pathMock, fastCsvOptsMock);
    });

    it('should resolve with rows passed through "data" event emission', async () => {
      // Given
      const rowsMock = [
        ['1', '2', '3', '4'],
        ['5', '6', '7', '8'],
      ];
      const csvPromise = parseCsv(pathMock, fastCsvOptsMock);

      // When
      streamMock.emit('data', rowsMock[0]);
      streamMock.emit('data', rowsMock[1]);
      streamMock.end();

      const result = await csvPromise;

      // Then
      expect(result).toStrictEqual(rowsMock);
      streamMock.destroy();
    });

    it('should reject with error passed through "error" event emission', async () => {
      // Given
      const errorMock = new Error('HAHA !');
      const csvPromise = parseCsv(pathMock, fastCsvOptsMock);

      // When
      streamMock.emit('error', errorMock);

      // Then
      await expect(csvPromise).rejects.toThrow(errorMock);
      streamMock.destroy();
    });
  });

  describe('transformBoolean', () => {
    it('should convert specified column into boolean', () => {
      const csvList: Csv[] = [{ isBoolean: 'false', id: '1' }];
      const result = transformColumnsIntoBoolean(csvList, ['isBoolean']);
      expect(result).toStrictEqual([{ isBoolean: false, id: '1' }]);
    });

    it('should return string if the specified columns are not found', () => {
      const csvList: Csv[] = [{ isNotABoolean: 'false', id: '1' }];
      const result = transformColumnsIntoBoolean(csvList, ['isBoolean']);
      expect(result).toStrictEqual([{ isNotABoolean: 'false', id: '1' }]);
    });

    it('should work with many columns', () => {
      const csvList: Csv[] = [
        { isBoolean: 'false', isNotABoolean: 'false', isAlsoABoolean: 'true' },
      ];
      const result = transformColumnsIntoBoolean(csvList, [
        'isBoolean',
        'isAlsoABoolean',
      ]);

      expect(result).toStrictEqual([
        { isBoolean: false, isNotABoolean: 'false', isAlsoABoolean: true },
      ]);
    });

    it('should return false when string to convert is not "true"', () => {
      const csvList: Csv[] = [{ isBoolean: 'notACorrectBoolean', id: '1' }];
      const result = transformColumnsIntoBoolean(csvList, ['isBoolean']);
      expect(result).toStrictEqual([{ isBoolean: false, id: '1' }]);
    });

    it('should work even if the column to convert does not exist"', () => {
      const csvList: Csv[] = [
        { notToTransform: 'notABoolean', id: '1', empty: '' },
      ];
      const result = transformColumnsIntoBoolean(csvList, ['isBoolean']);
      expect(result).toStrictEqual([
        { notToTransform: 'notABoolean', id: '1', empty: '' },
      ]);
    });
  });

  describe('removeEmptyProperties', () => {
    it('should remove empty properties', () => {
      const csvList: Csv[] = [
        { notEmpty: 'content1', empty: '', notEmpty2: 'content2', empty2: '' },
      ];

      const result = removeEmptyProperties(csvList);
      expect(result).toStrictEqual([
        { notEmpty: 'content1', notEmpty2: 'content2' },
      ]);
    });
  });
});
