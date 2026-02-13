import { DateTime } from 'luxon';

import { getDatesFromLimit } from './get-dates-from-limit';
import { getXDaysAndXMonthsAgo } from './get-x-days-months-ago';

jest.mock('luxon');
jest.mock('./get-x-days-months-ago', () => ({
  getXDaysAndXMonthsAgo: jest.fn(),
}));

describe('getDatesFromLimit', () => {
  const timeZone = {
    zone: 'Europe/Paris',
  };

  it('should use the default value of 6 months if no argument is provided', () => {
    // Given

    const mockNow = DateTime.fromISO('2024-06-24T12:00:00.000+02:00', timeZone);
    const justBeforeNow = mockNow.minus({ days: 1 });
    const justBeforeLimit = mockNow.minus({ months: 6 }).plus({ days: 1 });
    const justAfterLimit = mockNow.minus({ months: 6 }).minus({ days: 1 });
    jest
      .mocked(getXDaysAndXMonthsAgo)
      .mockReturnValueOnce(justBeforeNow)
      .mockReturnValueOnce(justBeforeLimit)
      .mockReturnValueOnce(justAfterLimit);

    const expectedDates = [
      DateTime.fromISO('2024-06-23T00:00:00.000+02:00', timeZone),
      DateTime.fromISO('2023-12-25T00:00:00.000+01:00', timeZone),
      DateTime.fromISO('2023-12-23T00:00:00.000+01:00', timeZone),
    ];

    // When
    const result = getDatesFromLimit();

    // Then
    expect(result).toHaveLength(3);
    expect(result[0].toISO()).toBe(expectedDates[0].toISO());
    expect(result[1].toISO()).toBe(expectedDates[1].toISO());
    expect(result[2].toISO()).toBe(expectedDates[2].toISO());
  });

  it('should return an array of DateTime objects when a different month value is provided', () => {
    // Given
    const mockNow = DateTime.fromISO('2024-06-24T12:00:00.000+02:00', timeZone);
    const justBeforeNow = mockNow.minus({ days: 1 });
    const justBeforeLimit = mockNow.minus({ months: 3 }).plus({ days: 1 });
    const justAfterLimit = mockNow.minus({ months: 3 }).minus({ days: 1 });
    jest
      .mocked(getXDaysAndXMonthsAgo)
      .mockReturnValueOnce(justBeforeNow)
      .mockReturnValueOnce(justBeforeLimit)
      .mockReturnValueOnce(justAfterLimit);

    const result = getDatesFromLimit(3);

    const expectedDates = [
      DateTime.fromISO('2024-06-23T00:00:00.000+02:00', timeZone),
      DateTime.fromISO('2024-03-25T00:00:00.000+01:00', timeZone),
      DateTime.fromISO('2024-03-23T00:00:00.000+01:00', timeZone),
    ];

    expect(result).toHaveLength(3);
    expect(result[0].toISO()).toBe(expectedDates[0].toISO());
    expect(result[1].toISO()).toBe(expectedDates[1].toISO());
    expect(result[2].toISO()).toBe(expectedDates[2].toISO());
  });
});
