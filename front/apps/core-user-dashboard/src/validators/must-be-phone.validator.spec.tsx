import { mustBePhone } from './must-be-phone.validator';

describe('mustBePhone', () => {
  // Given
  const validatePhone = mustBePhone();

  it('should return undefined if no value is provided', () => {
    // When / Then
    expect(validatePhone()).toBeUndefined();
  });

  it('should return undefined for valid spaced phone numbers', () => {
    // When
    const result = validatePhone('01 22 33 44 55');

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined for valid international phone numbers', () => {
    // When
    const result = validatePhone('(+33) 1 22 33 44 55');

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined for valid dashed phone numbers', () => {
    // When
    const result = validatePhone('01-22-33-44-55');

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined for valid trimmed phone numbers', () => {
    // When
    const result = validatePhone('0122334455');

    // Then
    expect(result).toBeUndefined();
  });

  it('should return an error message for invalid phone number', () => {
    // When / Then
    expect(validatePhone('abcdefghij')).toBe(
      'Le format du numéro téléphone saisi n’est pas valide. Le format attendu est : (+33) 2 43 55 55 55 ou 01 22 33 44 55',
    );
  });
});
