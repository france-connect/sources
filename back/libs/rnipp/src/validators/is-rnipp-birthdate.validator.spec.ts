import { validateRnippBirthdate } from './is-rnipp-birthdate.validator';

describe('IsRnippBirthdate', () => {
  it('should return "false" if the argument is not a string', () => {
    // setup
    const notAString = 42;

    // action
    const valid = validateRnippBirthdate(notAString);

    // assert
    expect(valid).toStrictEqual(false);
  });

  it('should validate a date with YYYY-MM-DD format', () => {
    // setup
    const date = '1992-04-23';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should validate a date with YYYY-MM format', () => {
    // setup
    const date = '1992-04';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should validate a date with YYYY format', () => {
    // setup
    const date = '1992';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should not validate a date with YYYY-00-DD format', () => {
    // setup
    const date = '1992-00-23';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(false);
  });

  it('should not validate a badly formatted date', () => {
    // setup
    const date = '1992-04-23-00';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(false);
  });

  it('should not validate a random string', () => {
    // setup
    const date = '0MmF-4o/ZkE$1';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(false);
  });

  it('should not validate an invalid date (month)', () => {
    // setup
    const date = '1992-99-23';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(false);
  });

  it('should not validate an invalid date (day)', () => {
    // setup
    const date = '1992-04-99';

    // action
    const valid = validateRnippBirthdate(date);

    // assert
    expect(valid).toStrictEqual(false);
  });
});
