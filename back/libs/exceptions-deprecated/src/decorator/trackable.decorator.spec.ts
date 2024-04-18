import { Trackable } from './trackable.decorator';

describe('Trackable', () => {
  describe('isTrackable', () => {
    it('should log true by default', () => {
      // Given
      @Trackable()
      class ClassMockTrackable {}
      const classMock = new ClassMockTrackable();
      // When
      const result = Trackable.isTrackable(classMock);
      // Then
      expect(result).toBeTruthy;
    });

    it('should log false if decorator is not instantiate', () => {
      // Given
      class ClassMockNotTrackable {}
      const classMock = new ClassMockNotTrackable();
      // When
      const result = Trackable.isTrackable(classMock);
      // Then
      expect(result).toBeFalsy;
    });
  });
});
