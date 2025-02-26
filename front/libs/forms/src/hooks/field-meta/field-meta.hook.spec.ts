import { renderHook } from '@testing-library/react';

import { useFieldMeta } from './field-meta.hook';

describe('useFieldMeta', () => {
  it('should return hasError as true and correct errorMessage when meta has error and is touched', () => {
    // Given
    const meta = {
      error: 'any-error-message-mock',
      invalid: true,
      pristine: false,
      submitError: null,
      touched: true,
      valid: false,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'fr-input fr-input--error',
      isValid: false,
    });
  });

  it('should return hasError as true and correct errorMessage when meta has submitError and is touched', () => {
    // Given
    const meta = {
      error: null,
      invalid: true,
      pristine: false,
      submitError: 'any-error-message-mock',
      touched: true,
      valid: false,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'fr-input fr-input--error',
      isValid: false,
    });
  });

  it('should prioritize submitError over error when both are present', () => {
    // Given
    const meta = {
      error: 'any-error-message-mock',
      invalid: true,
      pristine: false,
      submitError: 'any-submit-error-message-mock',
      touched: true,
      valid: false,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'fr-input fr-input--error',
      isValid: false,
    });
  });

  it('should return isValid as true when field is touched, valid, and not pristine', () => {
    // Given
    const meta = {
      error: null,
      invalid: false,
      pristine: false,
      submitError: null,
      touched: true,
      valid: true,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: undefined,
      hasError: false,
      inputClassname: 'fr-input fr-input--valid',
      isValid: true,
    });
  });

  it('should return default values when field is pristine and untouched', () => {
    // Given
    const meta = {
      error: null,
      invalid: false,
      pristine: true,
      submitError: null,
      touched: false,
      valid: true,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: undefined,
      hasError: false,
      inputClassname: 'fr-input',
      isValid: false,
    });
  });

  it('should handle cases where no error or valid state is defined', () => {
    // Given
    const meta = {
      error: null,
      invalid: false,
      pristine: true,
      submitError: null,
      touched: true,
      valid: false,
    };

    // When
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current).toStrictEqual({
      errorMessage: undefined,
      hasError: false,
      inputClassname: 'fr-input',
      isValid: false,
    });
  });
});
