import { DateTime } from 'luxon';

export function getDayNow(): DateTime {
  const now = DateTime.now().setZone('Europe/Paris');
  return now;
}
