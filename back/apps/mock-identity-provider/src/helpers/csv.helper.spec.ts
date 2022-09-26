import { CsvParserStream, parseFile, Row } from '@fast-csv/parse';
import { mocked } from 'jest-mock';
import { PassThrough } from 'stream';

import { parseCsv } from './csv.helper';

jest.mock('@fast-csv/parse');

describe('parseCsv()', () => {
  const parseFileMock = mocked(parseFile);
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
