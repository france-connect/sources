import { renderHook } from '@testing-library/react';
import has from 'lodash.has';

import { t } from '@fc/i18n';

import { Validators } from '../../enums';
import { buildValidator, composeValidators } from '../../helpers';
import { isRequired } from '../../validators';
import { useFieldValidate } from './field-validate.hook';

// Given
jest.mock('lodash.has', () => jest.fn());
jest.mock('../../enums/validators.enum');
jest.mock('../../validators/is-required/is-required.validator');
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

  it('should preprend a validator to validators stack when the field is required', () => {
    // Given
    const validateFunc = jest.fn();
    const errorMessageMock = 'any-error-message-mock';

    const validators1 = () => expect.any(String);
    const validators2 = () => expect.any(String);
    const validatorsFuncsMock = [validators1, validators2];

    jest.mocked(t).mockReturnValueOnce(errorMessageMock);
    jest.mocked(isRequired).mockReturnValueOnce(validateFunc);
    jest.spyOn(Array.prototype, 'map').mockReturnValueOnce(validatorsFuncsMock);

    // When
    renderHook(() => useFieldValidate({ required: true, validators: [] }));

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.message.required');
    expect(isRequired).toHaveBeenCalledOnce();
    expect(isRequired).toHaveBeenCalledWith(errorMessageMock);
    expect(composeValidators).toHaveBeenCalledWith(validateFunc, validators1, validators2);
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

  it('should return undefined if there is no valid validators', () => {
    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: true,
        required: false,
        validators: [],
      }),
    );

    // Then
    expect(result.current).toBeUndefined();
    expect(composeValidators).not.toHaveBeenCalled();
  });

  it('should return a validate function', () => {
    // Given
    const validators1 = () => expect.any(String);
    const validators2 = () => expect.any(String);
    const validatorsFuncsMock = [validators1, validators2];

    const anyValidatorsMock = [expect.any(Object), expect.any(Object)];
    jest.mocked(has).mockReturnValueOnce(true).mockReturnValueOnce(true);
    jest.spyOn(validatorsMock, 'map').mockReturnValueOnce(validatorsFuncsMock);

    const validateMock = jest.fn();
    jest.mocked(buildValidator).mockReturnValueOnce(validators1).mockReturnValueOnce(validators2);
    jest.mocked(composeValidators).mockReturnValueOnce(validateMock);

    // When
    const { result } = renderHook(() =>
      useFieldValidate({
        disabled: false,
        required: false,
        validators: anyValidatorsMock,
      }),
    );

    // Then
    expect(composeValidators).toHaveBeenCalledOnce();
    expect(composeValidators).toHaveBeenCalledWith(validators1, validators2);
    expect(result.current).toStrictEqual(validateMock);
  });
});
