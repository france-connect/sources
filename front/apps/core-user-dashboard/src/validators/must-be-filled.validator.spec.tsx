import { mustBeFilled } from './must-be-filled.validator';

describe('mustBeFilled', () => {
  it('should return undefined if the value is non-empty', () => {
    // Given
    const validate = mustBeFilled();

    // When / Then
    expect(validate('hello')).toBeUndefined();
  });

  it('should return default message if the value is empty', () => {
    // Given
    const validate = mustBeFilled();

    // When / Then
    expect(validate('')).toBe('Ce champ est obligatoire');
  });

  it('should return default message if the value is empty after trimming', () => {
    // Given
    const validate = mustBeFilled();

    // When / Then
    expect(validate(' ')).toBe('Ce champ est obligatoire');
  });

  it('should return default message if the value is undefined', () => {
    // Given
    const validate = mustBeFilled();

    // When / Then
    expect(validate(undefined)).toBe('Ce champ est obligatoire');
  });

  it('should return custom message if provided and value is empty', () => {
    const customMessage = 'Custom message';
    const validate = mustBeFilled(customMessage);

    // When / Then
    expect(validate('')).toBe(customMessage);
  });
});
