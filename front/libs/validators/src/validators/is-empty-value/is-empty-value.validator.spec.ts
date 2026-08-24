import { Strings } from '@fc/common';

import { isEmptyValue } from './is-empty-value.validator';

describe('isEmptyValue', () => {
  it('should return true if the value is undefined', () => {
    // When / Then
    expect(isEmptyValue(undefined)).toBeTrue();
  });

  it('should return true if the value is null', () => {
    // When / Then
    expect(isEmptyValue(null)).toBeTrue();
  });

  it('should return true if the value is an empty string', () => {
    // When / Then
    expect(isEmptyValue(Strings.EMPTY_STRING)).toBeTrue();
  });

  it('should return false if the value is not an empty string', () => {
    // When / Then
    expect(isEmptyValue('not-empty')).toBeFalse();
  });

  it('should return false if the value is a boolean', () => {
    // When / Then
    expect(isEmptyValue(true)).toBeFalse();
  });

  it('should return false if the value is a number', () => {
    // When / Then
    expect(isEmptyValue(42)).toBeFalse();
  });

  it('should return false if the value is a object', () => {
    // When / Then
    expect(isEmptyValue({})).toBeFalse();
  });
});
