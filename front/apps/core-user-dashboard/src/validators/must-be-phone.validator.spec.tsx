import { mustBePhone } from './must-be-phone.validator';

describe('mustBePhone', () => {
  // Given
  const validatePhone = mustBePhone();
  const validNumbers = ['01 22 33 44 55', '(+33) 1 22 33 44 55', '01-22-33-44-55', '0122334455'];
  const invalidNumber = 'abcdefghij';

  it('should return undefined if no value is provided', () => {
    // When / Then
    expect(validatePhone()).toBeUndefined();
  });

  it('should return undefined for valid phone numbers', () => {
    // When / Then
    validNumbers.forEach((number) => {
      expect(validatePhone(number)).toBeUndefined();
    });
  });

  it('should return an error message for invalid phone number', () => {
    // When / Then
    expect(validatePhone(invalidNumber)).toBe(
      'Le format du numéro téléphone saisi n’est pas valide. Le format attendu est : (+33) 2 43 55 55 55 ou 01 22 33 44 55',
    );
  });
});
