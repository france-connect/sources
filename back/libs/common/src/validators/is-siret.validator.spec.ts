import { IsSiretConstraint } from './is-siret.validator';

const constraint = new IsSiretConstraint();

describe('IsSiretValidator', () => {
  describe('validate', () => {
    it('should validate a Luhn compliant siret of La Poste', () => {
      expect(constraint.validate('35600000000048')).toBeTrue();
    });

    it('should validate a non Luhn compliant siret of la poste', () => {
      expect(constraint.validate('35600000009075')).toBeTrue();
    });

    it('should not validate a non Luhn and non "mulltiple of five rule" compliant siret of la poste', () => {
      expect(constraint.validate('35600000009076')).toBeFalse();
    });

    it('should validate a string number of 14 figures without empty spaces', () => {
      expect(constraint.validate('81801912700021')).toBeTrue();
    });

    it('should not validate a lunh compliant string number of 13 figures', () => {
      expect(constraint.validate('5521005540026')).toBeFalse();
    });

    it('should validate a string number of 14 figures with spaces', () => {
      expect(constraint.validate('5521 0055 400 260')).toBeTrue();
    });

    it('should not validate a string with more than 14 figures', () => {
      expect(constraint.validate('5521 0055 400 260 0')).toBeFalse();
    });

    it('should not validate a string number of more than 14 figures without empty spaces', () => {
      expect(constraint.validate('55210055400260000')).toBeFalse();
    });

    it('should not validate a random string of 14 characters', () => {
      expect(constraint.validate('imnotavalidint')).toBeFalse();
    });

    it('should not validate a number', () => {
      expect(constraint.validate(35600000012345)).toBeFalse();
    });

    it('should not validate a empty siret', () => {
      expect(constraint.validate('')).toBeFalse();
    });

    it('should not validate a undefined siret', () => {
      expect(constraint.validate(null)).toBeFalse();
    });
  });

  describe('luhnChecksum', () => {
    it('should return the luhn checksum of a string', () => {
      expect(constraint['luhnChecksum']('1111')).toBe(6);
    });

    it('should return the luhn checksum of a string', () => {
      expect(constraint['luhnChecksum']('123')).toBe(8);
    });

    it('should return the luhn checksum of a string', () => {
      expect(constraint['luhnChecksum']('8763')).toBe(20);
    });

    it('should return the luhn checksum of a string', () => {
      expect(constraint['luhnChecksum']('5521005540026')).toBe(30);
    });
  });

  describe('isValidLaPosteSiretAlternative', () => {
    it('should return false when SIREN is not La Poste one', () => {
      expect(
        constraint['isValidLaPosteSiretAlternative']('12345678901234'),
      ).toBeFalse();
    });

    it('should return false when SIREN is La Poste but sum of parts is not multiple of five', () => {
      expect(
        constraint['isValidLaPosteSiretAlternative']('35600000000048'),
      ).toBeFalse();
    });

    it('should return true when SIREN is La Poste and sum of parts is multiple of five', () => {
      expect(
        constraint['isValidLaPosteSiretAlternative']('35600000009075'),
      ).toBeTrue();
    });
  });

  describe('defaultMessage', () => {
    it('should return specific message if siret is invalid', () => {
      expect(constraint.defaultMessage()).toEqual('Le siret est invalide.');
    });
  });
});
