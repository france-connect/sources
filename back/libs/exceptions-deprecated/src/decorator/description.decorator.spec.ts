import { Description } from './description.decorator';

describe('Description exception decorator', () => {
  describe('getDescription', () => {
    it("should output 'N/A' if decorator is not instantiated", () => {
      // Given
      class ClassMockNotDescription {}
      const classMock = new ClassMockNotDescription();
      // When
      const result = Description.getDescription(classMock);
      // Then
      expect(result).toStrictEqual('N/A');
    });

    it('should output message defined in parameters if decorator is instantiated', () => {
      // Given
      @Description('Lorem ipsum dolor sit amet')
      class ClassMockDescription {}
      const classMock = new ClassMockDescription();
      // When
      const result = Description.getDescription(classMock);
      // Then
      expect(result).toStrictEqual('Lorem ipsum dolor sit amet');
    });
  });
});
