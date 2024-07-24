import { DateTime } from 'luxon';

import { getDayNow } from './get-day-now';

describe('getDayNow', () => {
  it('should return an instance of DateTime', () => {
    // When
    const result = getDayNow();

    // Then
    expect(result).toBeInstanceOf(DateTime);
  });

  it('should return the current time in Europe/Paris timezone', () => {
    // Given
    const mockNow = DateTime.now().setZone('Europe/Paris');

    // When
    const result = getDayNow();

    // Then
    expect(result.zoneName).toBe('Europe/Paris');
    expect(result.toISO()).toBe(mockNow.toISO());
  });
});
