import { safelyParseJson } from './safely-parse-json';

describe('safelyParseJson', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('should remove __proto__ key during parsing', () => {
    // Given
    const json = '{"user":{"__proto__":{"admin": true}}}';

    // When
    const result = safelyParseJson(json);

    // Then
    expect(result).toEqual({ user: {} });
    // Not a call to console.error
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should throw TypeError if value is not valid JSON', () => {
    // Given
    const invalidJson = 'not a valid JSON string';

    // When / Then
    expect(() => {
      safelyParseJson(invalidJson);
    }).toThrow(TypeError);
    // Not a call to console.error
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should display params value if is not valid JSON', () => {
    // Given
    const invalidJson = 'not a valid JSON string';

    // When / Then
    expect(() => {
      safelyParseJson(invalidJson);
    }).toThrow('JSON not parsable');
    // Not a call to console.error
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
