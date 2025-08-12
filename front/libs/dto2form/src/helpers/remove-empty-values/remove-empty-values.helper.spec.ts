import { Strings } from '@fc/common';

import { removeEmptyValues } from './remove-empty-values.helper';

describe('removeEmptyValues', () => {
  it('should filter empty values using the preSubmit function', async () => {
    // Given
    const stringWithSpaces = '    ';
    const formValues = {
      fieldAnyArrayString: ['any-field-string-mock', 'any-field-string-mock'],
      fieldAnyString: 'any-field-string-mock',
      fieldBooleanNegative: false,
      fieldBooleanPositive: true,
      fieldEmptyArray: [Strings.EMPTY_STRING],
      fieldEmptySpacedArray: [Strings.EMPTY_STRING, stringWithSpaces],
      fieldEmptySpacedString: stringWithSpaces,
      fieldEmptyString: Strings.EMPTY_STRING,
      fieldMultipleEmptyArray: [Strings.EMPTY_STRING, Strings.EMPTY_STRING, Strings.EMPTY_STRING],
      fieldNumber: 0,
    };

    // When
    const result = await removeEmptyValues(formValues);

    // Then
    expect(result).toEqual({
      fieldAnyArrayString: ['any-field-string-mock', 'any-field-string-mock'],
      fieldAnyString: 'any-field-string-mock',
      fieldBooleanNegative: false,
      fieldBooleanPositive: true,
      fieldEmptySpacedArray: [Strings.EMPTY_STRING, stringWithSpaces],
      fieldEmptySpacedString: stringWithSpaces,
      fieldNumber: 0,
    });
  });
});
