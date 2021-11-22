import { RnippPivotIdentity } from './rnipp-pivot-identity.dto';

describe('RnippPivotIdentity', () => {
  describe('shouldValidateBirthplace', () => {
    it('should return "true" if the property "birthcountry" of the given object value is "99100" (COG France)', () => {
      // setup
      const instanceMock = {
        birthcountry: '99100',
      };

      // action
      const valid = RnippPivotIdentity.shouldValidateBirthplace(
        instanceMock as unknown as RnippPivotIdentity,
      );

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('should return "false" if the property "birthcountry" of the given object value is not "99100" (COG France)', () => {
      // setup
      const instanceMock = {
        birthcountry: '99142',
      };

      // action
      const valid = RnippPivotIdentity.shouldValidateBirthplace(
        instanceMock as unknown as RnippPivotIdentity,
      );

      // assert
      expect(valid).toStrictEqual(false);
    });
  });
});
