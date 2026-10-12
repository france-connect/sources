import { validateCheckbox } from './validate-checkbox';

describe('validateCheckbox', () => {
  it('should return undefined when checkbox is checked', () => {
    // When / Then
    expect(validateCheckbox(true)).toBeUndefined();
  });

  it('should return an error message when checkbox is unchecked', () => {
    // When
    const result = validateCheckbox(false);

    // Then
    expect(result).toBe('Veuillez cocher cette case si vous souhaitez continuer');
  });

  it('should return an error message when value is undefined', () => {
    // When
    const result = validateCheckbox(undefined);

    // Then
    expect(result).toBe('Veuillez cocher cette case si vous souhaitez continuer');
  });
});
