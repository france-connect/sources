import { DateTime } from 'luxon';

import { safelyParseJson } from '../safely-parse-json';
import { getDayNow } from './get-day-now';

export function extractDates(datesArray: string): DateTime[] {
  let dates: DateTime[];

  try {
    const values = safelyParseJson(datesArray);
    if (!Array.isArray(values)) {
      throw new Error(`${JSON.stringify(values)} is not an array`);
    }

    dates = values
      .map((value) => DateTime.fromISO(value, { zone: 'Europe/Paris' }))
      .filter(({ isValid }) => isValid);
  } catch (error) {
    throw new Error(`Sequences param must be a JSON array : ${error.message}`);
  }

  // Default value
  if (!dates.length) {
    dates = [getDayNow()];
  }

  return dates;
}
