import type { DateTimeFormatOptions } from 'luxon';
import { DateTime } from 'luxon';

import { Timezones } from '../../enums';
import type { ISODate } from '../../types';

export const isoToDate = (
  date: ISODate,
  format: DateTimeFormatOptions = DateTime.DATE_SHORT,
  tz: string = Timezones.EUROPE_PARIS,
): string => DateTime.fromISO(date, { zone: tz }).setLocale('fr').toLocaleString(format);
