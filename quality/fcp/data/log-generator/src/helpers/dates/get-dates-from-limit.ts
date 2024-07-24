import { type DateTime } from 'luxon';

import { getXDaysAndXMonthsAgo } from './';

export function getDatesFromLimit(month = 6): DateTime[] {
  const justBeforeNow = getXDaysAndXMonthsAgo(1);
  const justBeforeLimit = getXDaysAndXMonthsAgo(-1, month);
  const justAfterLimit = getXDaysAndXMonthsAgo(1, month);
  const dates = [justBeforeNow, justBeforeLimit, justAfterLimit].map((date) =>
    date.startOf('day'),
  );
  return dates;
}
