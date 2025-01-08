import { getReadableDateFromTime } from './get-readable-date-from-time.util';

describe('getReadableDateFromTime()', () => {
  it('should return the correct formatted date string for a given timestamp', () => {
    // Given
    const timestamp = Date.UTC(2021, 11, 1, 0, 0, 0);

    // When
    const result = getReadableDateFromTime(timestamp);

    // Then
    expect(result).toBe('01/12/2021 01:00:00'); // Paris is UTC+1
  });

  it('should return "Invalid Date" for an invalid timestamp', () => {
    // Given
    const timestamp = NaN;

    // When
    const result = getReadableDateFromTime(timestamp);

    // Then
    expect(result).toBe('Invalid Date');
  });
});
