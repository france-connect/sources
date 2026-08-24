import { DateTime } from 'luxon';

export function getPreviousSemester(): string {
  const now = DateTime.utc();

  if (now.month <= 6) {
    return `${now.year - 1}-07`;
  }

  return `${now.year}-01`;
}
