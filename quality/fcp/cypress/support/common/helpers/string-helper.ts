import { DateTime } from 'luxon';

export const capitalize = (word: string): string => {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
};

export function formatLocalDate(localDate: string): string {
  const dt = DateTime.fromFormat(localDate, 'dd/MM/yyyy');
  if (!dt.isValid) {
    throw new Error(
      `Invalid date format: ${localDate}. Expected format is dd/MM/yyyy.`,
    );
  }
  return dt.toFormat('yyyy-MM-dd');
}
