import { TracksConfig } from '@fc/tracks';

// API URLs
const API_BASE_URL = `/api`;

const Tracks: TracksConfig = {
  LUXON_FORMAT_HOUR_MINS: 'T',
  LUXON_FORMAT_TIMEZONE: 'z',
  LUXON_FORMAT_DAY: 'DDD',
  LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
  API_ROUTE_TRACKS: `${API_BASE_URL}/traces`,
  API_ROUTE_USER_INFOS: `${API_BASE_URL}/me`,
};

export default Tracks;
