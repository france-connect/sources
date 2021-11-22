import {
  isStringOrRegExp,
  IsStringOrRegExpConstraint,
} from './is-string-or-regexp.validator';

describe('IsStringOrRegExpConstraint', () => {
  describe('isStringOrRegExp', () => {
    it('should return true if the value is a string', () => {
      // action
      const result = isStringOrRegExp('a string');

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should return true if the value is a RegExp', () => {
      // action
      const result = isStringOrRegExp(/RegExp/);

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should return false if the value is neither a string or a RegExp', () => {
      // action
      const result = isStringOrRegExp(42);

      // expect
      expect(result).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // setup
      const instance = new IsStringOrRegExpConstraint();

      // action
      const result = instance.defaultMessage();

      // expect
      expect(result).toStrictEqual('The value must be a string or RegExp');
    });
  });
});
