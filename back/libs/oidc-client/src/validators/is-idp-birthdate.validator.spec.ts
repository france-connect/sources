import { registerDecorator, ValidationOptions } from 'class-validator';

import {
  IsIdpBirthdate,
  validateIdpBirthdate,
} from './is-idp-birthdate.validator';

jest.mock('class-validator', () => ({
  registerDecorator: jest.fn(),
}));

describe('IsIdpBirthdate', () => {
  it('should call registerDecorator with correct parameters', () => {
    // Given
    const validationOptions: ValidationOptions = {
      message: 'Invalid birthdate',
    };

    // When
    IsIdpBirthdate(validationOptions)(Object, 'birthdate');

    // Then
    expect(registerDecorator).toHaveBeenCalledWith({
      name: 'isIdpBirthdate',
      target: Object.constructor,
      propertyName: 'birthdate',
      constraints: [],
      options: validationOptions,
      validator: {
        validate: validateIdpBirthdate,
      },
    });
  });
});

describe('validateIdpBirthdate', () => {
  it('should return false if value is not a string', () => {
    // Given
    const value = 12345;

    // When / Then
    expect(validateIdpBirthdate(value)).toBe(false);
  });

  it('should return true for a valid presumed month and day', () => {
    // Given
    const value = '1990-00-00';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(true);
  });

  it('should return true for a valid presumed day', () => {
    // Given
    const value = '1990-05-00';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(true);
  });

  it('should return true for a valid full date', () => {
    // Given
    const value = '1990-05-15';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(true);
  });

  it('should return false for an invalid date format (YYYY-00-DD)', () => {
    // Given
    const value = '1990-00-15';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(false);
  });

  it('should return false for an invalid date format (YYYY-MM)', () => {
    // Given
    const value = '1990-05';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(false);
  });

  it('should return false for an invalid date format (YYYY)', () => {
    // Given
    const value = '1990';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(false);
  });

  it('should return false for an invalid full date', () => {
    // Given
    const value = '1990-02-30';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(false);
  });

  it('should return false for an invalid presumed day', () => {
    // Given
    const value = '1990-13-00';

    // When
    const result = validateIdpBirthdate(value);

    // Then
    expect(result).toBe(false);
  });
});
