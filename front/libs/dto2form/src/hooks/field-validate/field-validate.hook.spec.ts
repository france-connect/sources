import { renderHook } from '@testing-library/react';
import type { FieldValidator } from 'final-form';
import has from 'lodash.has';

import { Validators } from '../../enums';
import { buildValidator, composeValidators } from '../../helpers';
import { useFieldValidate } from './field-validate.hook';

// Given
jest.mock('lodash.has', () => jest.fn());
jest.mock('../../enums/validators.enum');
jest.mock('../../helpers/build-validator/build-validator.helper');
jest.mock('../../helpers/compose-validators/compose-validators.helper');

describe('useFieldValidate', () => {
  // Given
  const validatorsMock = [
    { errorLabel: 'any-error-label-mock-1', name: 'mock1' },
    { errorLabel: 'any-error-label-mock-2', name: 'mock2' },
    { errorLabel: 'any-error-label-mock-3', name: 'mock3' },
  ];

  it('should call lodash.has for each validator', () => {
    // Given
    jest.mocked(has).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);

    // When
    renderHook(() =>
      useFieldValidate({ required: expect.any(Boolean), validators: validatorsMock }),
    );

    // Then
    expect(has).toHaveBeenCalledTimes(3);
    expect(has).toHaveBeenNthCalledWith(1, Validators, 'mock1');
    expect(has).toHaveBeenNthCalledWith(2, Validators, 'mock2');
    expect(has).toHaveBeenNthCalledWith(3, Validators, 'mock3');
  });

  it('should call buildValidator for only each valid validator', () => {
    // Given
    const requiredMock = false;
    jest.mocked(has).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);

    // When
    renderHook(() => useFieldValidate({ required: requiredMock, validators: validatorsMock }));

    // Then
    expect(buildValidator).toHaveBeenCalledTimes(2);
    expect(buildValidator).toHaveBeenNthCalledWith(
      1,
      { errorLabel: 'any-error-label-mock-1', name: 'mock1' },
      true,
    );
    expect(buildValidator).toHaveBeenNthCalledWith(
      2,
      { errorLabel: 'any-error-label-mock-3', name: 'mock3' },
      true,
    );
  });

  it('should return undefined if the field is disabled', () => {
    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: true,
        required: false,
        validators: validatorsMock,
      }),
    );

    // Then
    expect(result.current).toBeUndefined();
    expect(composeValidators).not.toHaveBeenCalled();
  });

  it('should return undefined if validators array is empty', () => {
    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: false,
        required: false,
        validators: [],
      }),
    );

    // Then
    expect(result.current).toBeUndefined();
    expect(composeValidators).not.toHaveBeenCalled();
  });

  it('should return undefined if there is no valid validators', () => {
    // Given
    jest
      .mocked(has)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: false,
        required: false,
        validators: validatorsMock,
      }),
    );

    // Then
    expect(result.current).toBeUndefined();
    expect(composeValidators).not.toHaveBeenCalled();
  });

  it('should return a validate function', () => {
    // Given
    const validateMock1 = jest.fn();
    const validateMock2 = jest.fn();
    const validateMock3 = jest.fn();
    const validators1Mock = jest.fn(() => validateMock1);
    const validators2Mock = jest.fn(() => validateMock2);
    const validators3Mock = jest.fn(() => validateMock3);
    const composedValidateMock = Symbol(
      'composedValidateMock',
    ) as unknown as FieldValidator<string>;

    jest.mocked(composeValidators).mockReturnValueOnce(composedValidateMock);
    jest.mocked(has).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
    jest
      .mocked(buildValidator)
      .mockReturnValueOnce(validators1Mock)
      .mockReturnValueOnce(validators2Mock)
      .mockReturnValueOnce(validators3Mock);

    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: false,
        required: false,
        validators: validatorsMock,
      }),
    );

    // Then
    expect(composeValidators).toHaveBeenCalledOnce();
    expect(composeValidators).toHaveBeenCalledWith(validateMock1, validateMock2, validateMock3);
    expect(result.current).toStrictEqual(composedValidateMock);
  });
});
