import {
  getClassMethodCaller,
  getDateTime,
  slugLibName,
} from './logger-helpers.utils';

describe('getDateTime()', () => {
  it('should returns the current date as a string', () => {
    // When
    const result = getDateTime();
    // Then
    expect(typeof result).toBe('string');
  });
});

describe('getClassMethodCaller()', () => {
  it('should returns the current class-method caller in string', () => {
    // When
    const result = getClassMethodCaller();
    // Then
    expect(typeof result).toBe('string');
  });
});

describe('slugLibName()', () => {
  it('should convert a `camelCase` to `snakeCase` string without the last uppercase element', () => {
    // Given
    const camelCaseMock = 'LibNameValueValue';
    const snakeCaseMock = 'lib-name-value'; // without last element
    // When
    const result = slugLibName(camelCaseMock);
    // Then
    expect(result).toStrictEqual(snakeCaseMock);
    expect(typeof result).toBe('string');
  });
});
