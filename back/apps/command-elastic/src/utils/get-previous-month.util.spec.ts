import { getPreviousMonth } from './get-previous-month.util';

describe('getPreviousMonth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the previous month from a mid-year date', () => {
    // Given
    jest.setSystemTime(new Date('2025-08-15T10:00:00Z'));

    // When
    const result = getPreviousMonth();

    // Then
    expect(result).toBe('2025-07');
  });

  it('should return the previous year when the month is January', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-05T10:00:00Z'));

    // When
    const result = getPreviousMonth();

    // Then
    expect(result).toBe('2024-12');
  });
});
