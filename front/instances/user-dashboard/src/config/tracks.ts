/* istanbul ignore file */

// declarative file
import { TracksConfig } from '@fc/tracks';

// API URLs
export const API_BASE_URL = `/api`;

export const Tracks: TracksConfig = {
  API_ROUTE_TRACKS: `${API_BASE_URL}/traces`,
  API_ROUTE_USER_INFOS: `${API_BASE_URL}/me`,
  LUXON_FORMAT_DATETIME_SHORT_FR: "D 'à' T",
  LUXON_FORMAT_DAY: 'DDD',
  LUXON_FORMAT_HOUR_MINS: 'T',
  LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
  LUXON_FORMAT_TIMEZONE: 'z',
};
