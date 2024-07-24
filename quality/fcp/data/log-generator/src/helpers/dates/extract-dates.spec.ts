import { extractDates } from './extract-dates';
import { getXDaysAndXMonthsAgo } from './get-x-days-months-ago';

jest.mock('luxon');

const mockNow = getXDaysAndXMonthsAgo(0);
const mockYesterday = getXDaysAndXMonthsAgo(1);
const mock3MonthsAgo = getXDaysAndXMonthsAgo(0, 3);
const mock4MonthsAgo = getXDaysAndXMonthsAgo(0, 3);

describe('extractDates', () => {
  it('should return an array with one date', () => {
    // Given
    const datesArray = [mockNow];
    const datesISO = datesArray.map((date) => date.toISO());
    const mockDates = JSON.stringify(datesISO);
    // When
    const result = extractDates(mockDates);
    // Then
    expect(result).toEqual(datesArray);
  });

  it('should return an array with several dates', () => {
    // Given
    const datesArray = [mockNow, mockYesterday, mock3MonthsAgo, mock4MonthsAgo];
    const datesISO = datesArray.map((date) => date.toISO());
    const mockDates = JSON.stringify(datesISO);
    // When
    const result = extractDates(mockDates);
    // Then
    expect(result).toEqual(datesArray);
  });

  it('should return an array with only valid dates', () => {
    // Given
    const datesArray = [mockNow, mock3MonthsAgo, mock4MonthsAgo];
    const datesISO = datesArray.map((date) => date.toISO());
    datesISO.push('not a date');
    const mockDates = JSON.stringify(datesISO);
    // When
    const result = extractDates(mockDates);
    // Then
    expect(result).toEqual(datesArray);
  });

  it('should throw an error if the dates parameter is not parsable', () => {
    // When / Then
    expect(() => extractDates('')).toThrow(
      'Sequences param must be a JSON array : JSON not parsable',
    );
  });

  it('should throw an error if the dates parameter is not a string containing an array', () => {
    // When / Then
    expect(() => extractDates('{}')).toThrow(
      'Sequences param must be a JSON array : {} is not an array',
    );
  });

  it("should return an array with today's date when the array is empty", () => {
    // Given
    const mockDates = '[]';
    // When
    const result = extractDates(mockDates);
    // Then
    expect(result).toEqual([mockNow]);
  });

  it("should return an array with today's date when the array contains only invalid dates", () => {
    // When / Then
    const result = extractDates('["test"]');
    // Then
    expect(result).toEqual([mockNow]);
  });
});
