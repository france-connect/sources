import { composeValidators } from './validator.util';

describe('composeValidators', () => {
  const required = (value: string) => (value ? undefined : 'Required');
  const isNumber = (value: string) =>
    Number.isNaN(Number(value)) ? 'Must be a number' : undefined;

  it('should return undefined if all validators pass', () => {
    const validate = composeValidators(required, isNumber);
    const result = validate('123');

    expect(result).toBeUndefined();
  });

  it('should return the first error', () => {
    const validate = composeValidators(required, isNumber);
    const result = validate('');

    expect(result).toBe('Required');
  });

  it('should return second error', () => {
    const validate = composeValidators(required, isNumber);
    const result = validate('not a number');

    expect(result).toBe('Must be a number');
  });
});
