import { getCwdForDirectory, replaceAllOccurrences } from './utils.helper';

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

describe('replaceAllOccurrences', () => {
  const input = 'Hello World Hello';

  it('replace single occurrence', () => {
    const findsMock = 'Hello';
    const replaceMock = 'Hi';
    const result = replaceAllOccurrences(input, findsMock, replaceMock);
    expect(result).toBe('Hi World Hi');
  });

  it('replace multiple occurrences with array', () => {
    const findsMock = ['Hello', 'World'];
    const replaceMock = 'Hi';
    const result = replaceAllOccurrences(input, findsMock, replaceMock);
    expect(result).toBe('Hi Hi Hi');
  });
});
