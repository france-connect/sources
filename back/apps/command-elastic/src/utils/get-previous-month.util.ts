import { DateTime } from 'luxon';

export function getPreviousMonth(): string {
  return DateTime.utc().minus({ months: 1 }).toFormat('yyyy-MM');
}
