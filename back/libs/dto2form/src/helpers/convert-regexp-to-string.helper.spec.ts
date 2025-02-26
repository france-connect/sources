import { convertRegExpToStrings } from './convert-regexp-to-string.helper';

describe('convertRegExpToStrings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return validator with regExp transform into string', () => {
    // Given
    const validationArgsMock = [/^[a-zA-Z0-9-]+$/];

    const expected = ['^[a-zA-Z0-9-]+$'];

    // When
    const result = convertRegExpToStrings(validationArgsMock);

    // Then
    expect(result).toEqual(expected);
  });

  it('should return validator with complex regExp transform into string', () => {
    // Given
    const validationArgsMock = [
      /^[A-Za-zÀ-žØ-öø-ÿ0-9\s,.:!\(\)_'\-\u0026-\u002f]+$/,
    ];

    const expected = [
      "^[A-Za-zÀ-žØ-öø-ÿ0-9\\s,.:!\\(\\)_'\\-\\u0026-\\u002f]+$",
    ];

    // When
    const result = convertRegExpToStrings(validationArgsMock);

    // Then
    expect(result).toEqual(expected);
  });

  it('should return validator even if no regExp found', () => {
    // Given
    const validationArgsMock = [
      {
        max: 64,
        min: 36,
      },
    ];

    // When
    const result = convertRegExpToStrings(validationArgsMock);

    // Then
    expect(result).toEqual(validationArgsMock);
  });

  it('should return an empty array if value is not defined', () => {
    // Given
    const validationArgsMock = undefined;

    // When
    const result = convertRegExpToStrings(validationArgsMock);

    // Then
    expect(result).toEqual([]);
  });

  it('should return an empty array if value is not an array', () => {
    // Given
    const validationArgsMock = 'foo' as unknown as unknown[];

    // When
    const result = convertRegExpToStrings(validationArgsMock);

    // Then
    expect(result).toEqual([]);
  });
});
