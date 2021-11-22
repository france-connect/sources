import { Loggable } from './loggable.decorator';

describe('Loggable', () => {
  describe('isLoggable', () => {
    it('should log true by default', () => {
      // Given
      @Loggable()
      class ClassMockLoggable {}
      const classMock = new ClassMockLoggable();
      // When
      const result = Loggable.isLoggable(classMock);
      // Then
      expect(result).toBeTruthy;
    });

    it('should log false if decorator is not instantiate', () => {
      // Given
      class ClassMockNotLoggable {}
      const classMock = new ClassMockNotLoggable();
      // When
      const result = Loggable.isLoggable(classMock);
      // Then
      expect(result).toBeFalsy;
    });
  });
});
