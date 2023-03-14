import { validate } from './acr-levels.validator';

describe('validate', () => {
  it('should return true if value is an object with all values being numbers', () => {
    expect(validate({ foo: 1, bar: 2 })).toBe(true);
  });

  it('should return false if value is an object with at least one value not being a number', () => {
    expect(validate({ foo: 1, bar: '2' })).toBe(false);
  });

  it('should return false if value is not an object', () => {
    expect(validate(1)).toBe(false);
  });
});
