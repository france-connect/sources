import { getPreviousSemester } from './get-previous-semester.util';

describe('getPreviousSemester', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return July of the previous year when running in January', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-05T10:00:00Z'));

    // When
    const result = getPreviousSemester();

    // Then
    expect(result).toBe('2024-07');
  });

  it('should return July of the previous year when running in June', () => {
    // Given
    jest.setSystemTime(new Date('2025-06-30T23:59:59Z'));

    // When
    const result = getPreviousSemester();

    // Then
    expect(result).toBe('2024-07');
  });

  it('should return January of the current year when running in July', () => {
    // Given
    jest.setSystemTime(new Date('2025-07-01T00:00:00Z'));

    // When
    const result = getPreviousSemester();

    // Then
    expect(result).toBe('2025-01');
  });

  it('should return January of the current year when running in December', () => {
    // Given
    jest.setSystemTime(new Date('2025-12-31T23:59:59Z'));

    // When
    const result = getPreviousSemester();

    // Then
    expect(result).toBe('2025-01');
  });
});
