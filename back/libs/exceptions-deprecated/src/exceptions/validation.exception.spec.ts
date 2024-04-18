import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  describe('constructor', () => {
    it('should should set `errors`property', () => {
      // Given
      const errors = [];
      // When
      const result = new ValidationException(errors);
      // Then
      expect(result.errors).toBe(errors);
    });
  });
  describe('factory', () => {
    it('should return an error instance', () => {
      // Given
      const errors = [];
      // When
      const result = ValidationException.factory(errors);
      // Then
      expect(result).toBeInstanceOf(ValidationException);
      expect(result.errors).toBe(errors);
    });
  });
});
