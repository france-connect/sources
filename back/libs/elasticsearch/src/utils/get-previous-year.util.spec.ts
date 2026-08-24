import { getPreviousYear } from './get-previous-year.util';

describe('getPreviousYear', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the previous year from a mid-year date', () => {
    // Given
    jest.setSystemTime(new Date('2025-08-15T10:00:00Z'));

    // When
    const result = getPreviousYear();

    // Then
    expect(result).toBe('2024');
  });

  it('should return the previous year when running on January 1st', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    // When
    const result = getPreviousYear();

    // Then
    expect(result).toBe('2024');
  });

  it('should return the previous year when running on December 31st', () => {
    // Given
    jest.setSystemTime(new Date('2025-12-31T23:59:59Z'));

    // When
    const result = getPreviousYear();

    // Then
    expect(result).toBe('2024');
  });
});
