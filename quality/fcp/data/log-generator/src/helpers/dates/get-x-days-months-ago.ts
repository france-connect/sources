import { type DateTime } from 'luxon';

import { getDayNow } from './get-day-now';

export function getXDaysAndXMonthsAgo(day: number, month = 0): DateTime {
  const now = getDayNow();
  const date = now.minus({ month }).minus({ day });
  return date;
}
