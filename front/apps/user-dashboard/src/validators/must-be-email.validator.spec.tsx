import { isEmail } from 'validator';

import { mustBeEmail } from './must-be-email.validator';

describe('mustBeEmail', () => {
  // Given
  const validate = mustBeEmail();

  it('should return undefined if the value is empty', () => {
    // When / Then
    expect(validate(undefined)).toBeUndefined();
  });

  it('should call validator.isEmail', () => {
    // When
    validate('value');

    // Then
    expect(isEmail).toHaveBeenCalledOnce();
    expect(isEmail).toHaveBeenCalledWith('value');
  });

  it('should return default message if the value is not an email', () => {
    // Given
    jest.mocked(isEmail).mockReturnValueOnce(false);

    // When / Then
    expect(validate('not an email')).toBe('Veuillez saisir une adresse électronique valide');
  });

  it('should return undefined if value is an email', () => {
    // Given
    jest.mocked(isEmail).mockReturnValueOnce(true);

    // When / Then
    expect(validate('mail@host.com')).toBeUndefined();
  });
});
