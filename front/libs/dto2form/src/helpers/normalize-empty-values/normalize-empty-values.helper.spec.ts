import { Strings } from '@fc/common';

import { normalizeEmptyValues } from './normalize-empty-values.helper';

// @NOTE use the real isEmptyValue implementation instead of
// the empty jest.fn() mock from __mocks__/@fc/validators,
// to avoid drifting away from the actual validator
jest.unmock('@fc/validators');

describe('normalizeEmptyValues', () => {
  const initialValues = {
    fieldAnyArray: ['default-a'],
    fieldAnyString: 'default-string',
    fieldArrayWithSpacedString: ['https://default.fr'],
    fieldBooleanNegative: true,
    fieldClearedString: 'default-cleared',
    fieldEmptyArray: [Strings.EMPTY_STRING],
    fieldEmptyString: 'default-empty',
    fieldNullString: 'default-null',
    fieldNumber: 42,
    fieldPartialArray: ['https://default.fr'],
    fieldSpacedString: 'default-spaced',
    fieldUndefinedInitial: undefined,
  };

  it('should normalize empty values using initial values as fallback', () => {
    // Given
    const formValues = {
      fieldAnyArray: ['a', 'b'],
      fieldAnyString: 'any-field-string-mock',
      fieldArrayWithSpacedString: ['https://a.fr', '  ', 'https://b.fr'],
      fieldBooleanNegative: false,
      fieldClearedString: undefined,
      fieldEmptyArray: [Strings.EMPTY_STRING, undefined, Strings.EMPTY_STRING, null],
      fieldEmptyString: Strings.EMPTY_STRING,
      fieldNullString: null,
      fieldNumber: 0,
      fieldPartialArray: ['https://a.fr', undefined, Strings.EMPTY_STRING, 'https://b.fr'],
      fieldSpacedString: '  ',
      fieldUndefinedInitial: 'any-value',
    };

    // When
    const result = normalizeEmptyValues(initialValues)(formValues);

    // Then
    expect(result).toEqual({
      fieldAnyArray: ['a', 'b'],
      fieldAnyString: 'any-field-string-mock',
      fieldArrayWithSpacedString: ['https://a.fr', '  ', 'https://b.fr'],
      fieldBooleanNegative: false,
      fieldClearedString: 'default-cleared',
      fieldEmptyArray: [Strings.EMPTY_STRING],
      fieldEmptyString: 'default-empty',
      fieldNullString: 'default-null',
      fieldNumber: 0,
      fieldPartialArray: ['https://a.fr', 'https://b.fr'],
      fieldSpacedString: '  ',
      fieldUndefinedInitial: null,
    });
  });

  it('should return null when initial value is undefined', () => {
    // Given
    const formValues = { unknownField: Strings.EMPTY_STRING };

    // When
    const result = normalizeEmptyValues({})(formValues);

    // Then
    expect(result).toEqual({ unknownField: null });
  });

  it('should merge initial values missing from form values', () => {
    // Given
    const formValues = { fieldAnyString: 'submitted' };

    // When
    const result = normalizeEmptyValues({
      fieldAnyString: 'default-string',
      fieldOnlyInInitial: 'only-initial',
    })(formValues);

    // Then
    expect(result).toEqual({
      fieldAnyString: 'submitted',
      fieldOnlyInInitial: 'only-initial',
    });
  });
});
