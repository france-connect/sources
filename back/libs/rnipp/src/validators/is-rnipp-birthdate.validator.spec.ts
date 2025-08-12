import { validateRnippBirthdate } from './is-rnipp-birthdate.validator';

describe('IsRnippBirthdate', () => {
  it('should return "false" if the argument is not a string', () => {
    // Given
    const notAString = 42;

    // When
    const valid = validateRnippBirthdate(notAString);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should validate a date with YYYY-MM-DD format', () => {
    // Given
    const date = '1992-04-23';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should validate a date with YYYY-MM format', () => {
    // Given
    const date = '1992-04';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should validate a date with YYYY format', () => {
    // Given
    const date = '1992';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should not validate a date with YYYY-00-DD format', () => {
    // Given
    const date = '1992-00-23';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should not validate a badly formatted date', () => {
    // Given
    const date = '1992-04-23-00';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should not validate a random string', () => {
    // Given
    const date = '0MmF-4o/ZkE$1';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should not validate an invalid date (month)', () => {
    // Given
    const date = '1992-99-23';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should not validate an invalid date (day)', () => {
    // Given
    const date = '1992-04-99';

    // When
    const valid = validateRnippBirthdate(date);

    // Then
    expect(valid).toStrictEqual(false);
  });
});
