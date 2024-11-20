import { getGenderFromRnippGender, getRnippGenderFromGender } from '.';

describe('OidcToRnippMapper', () => {
  describe('getGenderFromRnippGender', () => {
    it('should return "male" if "M" is given as argument', () => {
      // When
      const result = getGenderFromRnippGender('M');

      // Then
      expect(result).toStrictEqual('male');
    });

    it('should return "female" if "F" is given as argument', () => {
      // When
      const result = getGenderFromRnippGender('F');

      // Then
      expect(result).toStrictEqual('female');
    });

    it('should return "unspecified" if "I" is given as argument', () => {
      // When
      const result = getGenderFromRnippGender('I');

      // Then
      expect(result).toStrictEqual('unspecified');
    });

    it('should return an empty string if any other argument is given', () => {
      // When
      const result = getGenderFromRnippGender('H');

      // Then
      expect(result).toStrictEqual('');
    });
  });

  describe('getRnippGenderFromGender', () => {
    it('should return "M" if "male" is given as argument', () => {
      // When
      const result = getRnippGenderFromGender('male');

      // Then
      expect(result).toStrictEqual('M');
    });

    it('should return "F" if "female" is given as argument', () => {
      // When
      const result = getRnippGenderFromGender('female');

      // Then
      expect(result).toStrictEqual('F');
    });

    it('should return "I" if "unspecified" is given as argument', () => {
      // When
      const result = getRnippGenderFromGender('unspecified');

      // Then
      expect(result).toStrictEqual('I');
    });

    it('should return an empty string if any other argument is given', () => {
      // When
      const result = getRnippGenderFromGender('Apache Helicopter');

      // Then
      expect(result).toStrictEqual('');
    });
  });
});
