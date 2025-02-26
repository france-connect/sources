import * as SecureJsonParse from 'secure-json-parse';

import { OverrideCode } from '@fc/override-code';

import {
  overriddenBySafelyParseJson,
  safelyParseJson,
} from './safely-parse-json';

jest.mock('@fc/override-code', () => ({
  OverrideCode: {
    execWithOriginal: jest.fn(),
  },
}));

describe('safelyParseJson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe('overriddenBySafelyParseJson', () => {
    // Given
    const input = '{"user":{"admin": true}}';
    it('should call override library to execute secure-json-parse with original JSON.parse', () => {
      // When
      overriddenBySafelyParseJson(input);

      // Then
      expect(OverrideCode.execWithOriginal).toHaveBeenCalledExactlyOnceWith(
        JSON,
        'parse',
        'JSON.parse',
        expect.any(Function),
      );
    });

    it('should call pass a function with a call to safe-json-parse and provided input', () => {
      // Given
      const spy = jest.spyOn(SecureJsonParse, 'parse');
      overriddenBySafelyParseJson(input);
      const callback = OverrideCode.execWithOriginal['mock'].calls[0][3];

      // When
      callback();

      // Then
      expect(spy).toHaveBeenCalledExactlyOnceWith(input);
    });
  });
});
