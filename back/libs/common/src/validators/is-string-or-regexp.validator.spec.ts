import {
  isStringOrRegExp,
  IsStringOrRegExpConstraint,
} from './is-string-or-regexp.validator';

describe('IsStringOrRegExpConstraint', () => {
  describe('isStringOrRegExp', () => {
    it('should return true if the value is a string', () => {
      // When
      const result = isStringOrRegExp('a string');

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return true if the value is a RegExp', () => {
      // When
      const result = isStringOrRegExp(/RegExp/);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should return false if the value is neither a string or a RegExp', () => {
      // When
      const result = isStringOrRegExp(42);

      // Then
      expect(result).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // Given
      const instance = new IsStringOrRegExpConstraint();

      // When
      const result = instance.defaultMessage();

      // Then
      expect(result).toStrictEqual('The value must be a string or RegExp');
    });
  });
});
