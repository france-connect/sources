import { isNotEmpty } from './is-not-empty.validator';

describe('isNotEmpty', () => {
  describe('Non empty values', () => {
    it('should return true for any string', () => {
      expect(isNotEmpty('any string mock')).toBeTrue();
    });

    it('should return true for an array with items', () => {
      expect(isNotEmpty(['any', 123, ['any'], {}, false])).toBeTrue();
    });

    it('should return true if value is true', () => {
      expect(isNotEmpty(true)).toBeTrue();
    });

    it('should return true if value is false', () => {
      expect(isNotEmpty(false)).toBeTrue();
    });

    it('should return true if value is 0', () => {
      expect(isNotEmpty(true)).toBeTrue();
    });
  });

  describe('Empty values', () => {
    it('should return false for an empty string', () => {
      expect(isNotEmpty('')).toBeFalse();
    });

    it('should return false for an empty array', () => {
      expect(isNotEmpty([])).toBeFalse();
    });

    it('should return false for null', () => {
      expect(isNotEmpty(null)).toBeFalse();
    });

    it('should return false for undefined', () => {
      expect(isNotEmpty(undefined)).toBeFalse();
    });
  });
});
