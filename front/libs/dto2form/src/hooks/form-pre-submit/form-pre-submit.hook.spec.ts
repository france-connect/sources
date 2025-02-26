import { renderHook } from '@testing-library/react';
import React from 'react';

import { Strings } from '@fc/common';
import { isString } from '@fc/validators';

import { useFormPreSubmit } from './form-pre-submit.hook';

describe('useFormPreSubmit', () => {
  // Given
  const onSubmitMock = jest.fn();

  it('should return a function', () => {
    // Given
    const useCallbackMock = jest.fn();
    const useCallbackSpy = jest.spyOn(React, 'useCallback').mockReturnValueOnce(useCallbackMock);

    // When
    const { result } = renderHook(() => useFormPreSubmit(onSubmitMock));

    // Then
    expect(useCallbackSpy).toHaveBeenCalledOnce();
    expect(useCallbackSpy).toHaveBeenCalledWith(expect.any(Function), [onSubmitMock]);
    expect(result.current).toBe(useCallbackMock);
  });

  it('should filter empties values using the preSubmit function', () => {
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

    jest
      .mocked(isString)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    // When
    const { result } = renderHook(() => useFormPreSubmit(onSubmitMock));
    result.current(formValues);

    // Then
    expect(isString).toHaveBeenCalledTimes(10);
    expect(isString).toHaveBeenNthCalledWith(1, ['any-field-string-mock', 'any-field-string-mock']);
    expect(isString).toHaveBeenNthCalledWith(2, 'any-field-string-mock');
    expect(isString).toHaveBeenNthCalledWith(3, false);
    expect(isString).toHaveBeenNthCalledWith(4, true);
    expect(isString).toHaveBeenNthCalledWith(5, [Strings.EMPTY_STRING]);
    expect(isString).toHaveBeenNthCalledWith(6, [Strings.EMPTY_STRING, stringWithSpaces]);
    expect(isString).toHaveBeenNthCalledWith(7, stringWithSpaces);
    expect(isString).toHaveBeenNthCalledWith(8, Strings.EMPTY_STRING);
    expect(isString).toHaveBeenNthCalledWith(9, [
      Strings.EMPTY_STRING,
      Strings.EMPTY_STRING,
      Strings.EMPTY_STRING,
    ]);
    expect(isString).toHaveBeenNthCalledWith(10, 0);

    expect(onSubmitMock).toHaveBeenCalledOnce();
    expect(onSubmitMock).toHaveBeenCalledWith({
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
