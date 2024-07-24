import { safelyParseJson } from './safely-parse-json';

describe('safelyParseJson', () => {
  it('should remove __proto__ key during parsing', () => {
    // Given
    const json = '{"user":{"__proto__":{"admin": true}}}';

    // When
    const result = safelyParseJson(json);

    // Then
    expect(result).toEqual({ user: {} });
  });

  it('should throw TypeError if value is not valid JSON', () => {
    // Given
    const invalidJson = 'not a valid JSON string';

    // When / Then
    expect(() => {
      safelyParseJson(invalidJson);
    }).toThrow(TypeError);
  });

  it('should display params value if is not valid JSON', () => {
    // Given
    const invalidJson = 'not a valid JSON string';

    // When / Then
    expect(() => {
      safelyParseJson(invalidJson);
    }).toThrow('JSON not parsable');
  });
});
