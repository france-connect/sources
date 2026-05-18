import { DateTime } from 'luxon';

export const isRecent = (isoDate: string, minutes = 5): boolean => {
  const updatedAt = DateTime.fromISO(isoDate, { zone: 'utc' });
  return updatedAt.isValid && updatedAt.plus({ minutes }) > DateTime.utc();
};
