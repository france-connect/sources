import { FieldTypes } from '../../enums';
import { getFieldControlId } from './get-field-control-id.helper';

describe('getFieldControlId', () => {
  it('should build control id for string', () => {
    // When
    const result = getFieldControlId('any-string-type', 'email');

    // Then
    expect(result).toBe('form-input-any-string-type-email');
  });

  it('should build control id for type text', () => {
    // When
    const result = getFieldControlId(FieldTypes.TEXT, 'email');

    // Then
    expect(result).toBe('form-input-text-email');
  });

  it('should build control id for type select', () => {
    // When
    const result = getFieldControlId(FieldTypes.SELECT, 'country');

    // Then
    expect(result).toBe('form-input-select-country');
  });

  it('should build control id for type textarea', () => {
    // When
    const result = getFieldControlId(FieldTypes.TEXTAREA, 'comment');

    // Then
    expect(result).toBe('form-input-textarea-comment');
  });

  it('should build control id for type array', () => {
    // When
    const result = getFieldControlId(FieldTypes.ARRAY, 'items[0]');

    // Then
    expect(result).toBe('form-input-array-items[0]');
  });
});
