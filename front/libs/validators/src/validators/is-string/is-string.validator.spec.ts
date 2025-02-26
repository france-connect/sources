import { isString } from './is-string.validator';

describe('isString', () => {
  it('should return true for a string value', () => {
    expect(isString('hello')).toBeTrue();
    expect(isString('123')).toBeTrue();
    expect(isString('')).toBeTrue();
  });

  it('should return false for non-string values', () => {
    expect(isString(123)).toBeFalse();
    expect(isString(true)).toBeFalse();
    expect(isString(null)).toBeFalse();
    expect(isString(undefined)).toBeFalse();
    expect(isString({})).toBeFalse();
    expect(isString([])).toBeFalse();
    expect(isString(() => {})).toBeFalse();
  });
});
