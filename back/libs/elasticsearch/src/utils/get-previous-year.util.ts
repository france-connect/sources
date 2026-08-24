import { DateTime } from 'luxon';

export function getPreviousYear(): string {
  return DateTime.utc().minus({ years: 1 }).toFormat('yyyy');
}
