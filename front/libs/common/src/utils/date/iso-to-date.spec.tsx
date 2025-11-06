import { DateTime } from 'luxon';

import { isoToDate } from './iso-to-date';

describe('isoToDate', () => {
  it('should convert ISO date to formatted date string', () => {
    const isoDate = '2023-10-05T14:48:00.000Z';
    const formattedDate = isoToDate(isoDate);

    expect(formattedDate).toBe('05/10/2023');
  });

  it('should use custom format if provided', () => {
    const isoDate = '2023-10-05T14:48:00.000Z';
    const customFormat = DateTime.DATE_MED;
    const formattedDate = isoToDate(isoDate, customFormat);

    expect(formattedDate).toBe('5 oct. 2023');
  });

  it('should use custom timezone if provided', () => {
    const isoDate = '2023-10-05T14:48:00.000Z';
    const customTimezone = 'America/New_York';
    const formattedDate = isoToDate(isoDate, undefined, customTimezone);

    expect(formattedDate).toBe('05/10/2023');
  });
});
