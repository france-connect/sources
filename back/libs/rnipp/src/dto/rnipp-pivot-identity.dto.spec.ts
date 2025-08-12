import { RnippPivotIdentity } from './rnipp-pivot-identity.dto';

describe('RnippPivotIdentity', () => {
  describe('shouldValidateBirthplace', () => {
    it('should return "true" if the property "birthcountry" of the given object value is "99100" (COG France)', () => {
      // Given
      const instanceMock = {
        birthcountry: '99100',
      };

      // When
      const valid = RnippPivotIdentity.shouldValidateBirthplace(
        instanceMock as unknown as RnippPivotIdentity,
      );

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "false" if the property "birthcountry" of the given object value is not "99100" (COG France)', () => {
      // Given
      const instanceMock = {
        birthcountry: '99142',
      };

      // When
      const valid = RnippPivotIdentity.shouldValidateBirthplace(
        instanceMock as unknown as RnippPivotIdentity,
      );

      // Then
      expect(valid).toStrictEqual(false);
    });
  });
});
