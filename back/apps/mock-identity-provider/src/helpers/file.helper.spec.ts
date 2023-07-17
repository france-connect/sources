import { mocked } from 'jest-mock';
import * as recursive from 'recursive-readdir';

import { getFilesPathsFromDir, NON_CSV_GLOBAL } from './file.helper';

jest.mock('recursive-readdir');

describe('getFilesPathsFromDir()', () => {
  const pathMock = '/a/custom/path/directory';
  const filenames = ['path1.csv', 'path2.csv', 'path3.csv'];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    mocked(recursive).mockResolvedValue(filenames);
  });

  it('should call recursive with the path and the non csv global', async () => {
    // When
    await getFilesPathsFromDir(pathMock);

    // Then
    expect(recursive).toHaveBeenCalledTimes(1);
    expect(recursive).toHaveBeenCalledWith(pathMock, [NON_CSV_GLOBAL]);
  });

  it('should return the filenames', async () => {
    // When
    const result = await getFilesPathsFromDir(pathMock);

    // Then
    expect(result).toEqual(filenames);
  });
});
