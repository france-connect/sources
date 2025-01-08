import { InseeDbCountryCurrentInterface } from '../interface';
import {
  getCwdForDirectory,
  replaceAllOccurrences,
  ReplaceEmptyIsoCode,
} from './utils.helper';

describe('getCwdForDirectory', () => {
  // Mock la fonction process.cwd() pour contrôler la valeur du répertoire de travail actuel
  const mockCwd = '/root/directory';
  jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

  it('should return the correct joined path', () => {
    // Given
    const directory = 'subdirectory';
    const expectedPath = '/root/subdirectory';

    // When
    const result = getCwdForDirectory(directory);

    // Then
    expect(result).toEqual(expectedPath);
  });

  it('should handle empty directory name', () => {
    // Given
    const directory = '';
    const expectedPath = '/root';

    // When
    const result = getCwdForDirectory(directory);

    // Then
    expect(result).toEqual(expectedPath);
  });
});

describe('replaceAllOccurrences', () => {
  const input = 'Hello World Hello';

  it('should replace single occurrence', () => {
    // Given
    const findsMock = 'Hello';
    const replaceMock = 'Hi';

    // When
    const result = replaceAllOccurrences(input, findsMock, replaceMock);

    // Then
    expect(result).toBe('Hi World Hi');
  });

  it('should replace multiple occurrences with array', () => {
    // Given
    const findsMock = ['Hello', 'World'];
    const replaceMock = 'Hi';

    // When
    const result = replaceAllOccurrences(input, findsMock, replaceMock);

    // Then
    expect(result).toBe('Hi Hi Hi');
  });
});

describe('ReplaceEmptyIsoCode', () => {
  const csvDataMock = [
    { COG: '99100', CODEISO2: 'FR' },
    { COG: '99139', CODEISO2: 'PT' },
  ] as unknown as InseeDbCountryCurrentInterface[];

  it('should return codeiso2 if is present', () => {
    // Given
    const codeiso2Mock = '99100';
    const crpayMock = undefined;

    // When
    const result = ReplaceEmptyIsoCode(codeiso2Mock, crpayMock, csvDataMock);

    //Then
    expect(result).toBeUndefined;
  });

  it('should return undefined if no crpay is defined', () => {
    // Given
    const codeiso2Mock = undefined;
    const crpayMock = undefined;

    // When
    const result = ReplaceEmptyIsoCode(codeiso2Mock, crpayMock, csvDataMock);

    //Then
    expect(result).toBeUndefined;
  });

  it('should return new codeis2 matching between crpay and cog allowed', () => {
    // Given
    const codeiso2Mock = undefined;
    const crpayMock = '99139';
    const expected = 'PT';

    // When
    const result = ReplaceEmptyIsoCode(codeiso2Mock, crpayMock, csvDataMock);

    //Then
    expect(result).toEqual(expected);
  });
});
