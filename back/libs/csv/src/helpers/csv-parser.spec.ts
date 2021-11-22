import { CsvParserStream, parseFile, Row } from '@fast-csv/parse';
import { PassThrough } from 'stream';
import { mocked } from 'ts-jest/utils';

import { parseCsv } from './csv-parser';

jest.mock('@fast-csv/parse');

const cityDatabasePathMock = '/path/file';
const fastCsvOptsMock = {
  headers: true,
  ignoreEmpty: true,
  trim: true,
};

describe('parseCsv()', () => {
  const parseFileMock = mocked(parseFile);
  let streamMock;

  beforeEach(() => {
    streamMock = new PassThrough();
    parseFileMock.mockReturnValueOnce(
      streamMock as CsvParserStream<Row<any>, Row<any>>,
    );
  });

  it('should call parseFile() with cityDatabasePathMock and fastCsvOptsMock', async () => {
    // Given
    streamMock.end();

    // When
    await parseCsv(cityDatabasePathMock, fastCsvOptsMock);

    // Then
    expect(parseFileMock).toHaveBeenCalledTimes(1);
    expect(parseFileMock).toHaveBeenCalledWith(
      cityDatabasePathMock,
      fastCsvOptsMock,
    );
  });

  it('should resolve with rows passed through "data" event emission', async () => {
    // Given
    const rowsMock = [
      ['1', '2', '3', '4'],
      ['5', '6', '7', '8'],
    ];
    const csvPromise = parseCsv(cityDatabasePathMock, fastCsvOptsMock);
    streamMock.emit('data', rowsMock[0]);
    streamMock.emit('data', rowsMock[1]);
    streamMock.end();

    // When
    const result = await csvPromise;

    // Then
    expect(result).toStrictEqual(rowsMock);
    streamMock.destroy();
  });

  it('should reject with error passed through "error" event emission', async () => {
    // Given
    const errorMock = new Error('Unknown Error');
    const csvPromise = parseCsv(cityDatabasePathMock, fastCsvOptsMock);
    streamMock.emit('error', errorMock);

    // When / Then
    await expect(() => csvPromise).rejects.toThrow(errorMock);
    streamMock.destroy();
  });
});
