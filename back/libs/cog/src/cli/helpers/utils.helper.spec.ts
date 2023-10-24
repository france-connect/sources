import { getCwdForDirectory, getParameterValue } from './utils.helper';

describe('getParameterValue', () => {
  test('should return the value at the specified index', () => {
    const args = ['value1', 'value2', 'value3', 'value4'];
    expect(getParameterValue(args, 1)).toBe('value2');
    expect(getParameterValue(args, 3)).toBe('value4');
  });

  test('should return undefined if the index is out of range', () => {
    const args = ['value1'];
    expect(getParameterValue(args, 2)).toBeUndefined();
    expect(getParameterValue([], 0)).toBeUndefined();
  });

  test('should return undefined if the argument at the index is falsy', () => {
    const args = ['value1', '', 'value3'];
    expect(getParameterValue(args, 1)).toBeUndefined();
  });
});

describe('getCwdForDirectory', () => {
  // Mock la fonction process.cwd() pour contrôler la valeur du répertoire de travail actuel
  const mockCwd = '/root/directory';
  jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

  it('should return the correct joined path', () => {
    const directory = 'subdirectory';
    const expectedPath = '/root/subdirectory';

    const result = getCwdForDirectory(directory);

    expect(result).toEqual(expectedPath);
  });

  it('should handle empty directory name', () => {
    const directory = '';
    const expectedPath = '/root';

    const result = getCwdForDirectory(directory);

    expect(result).toEqual(expectedPath);
  });
});
